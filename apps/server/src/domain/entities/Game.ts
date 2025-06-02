import { Quiz } from "@domain/entities/Quiz.js";
import { Player } from "@domain/entities/Player.js";

import { GameManager } from "@domain/managers/GameManager.js";

import { GameConfig } from "@domain/contracts/configuration/GameConfigs.js";

import {
    GameEventMetadata,
    GameEvent,
    PlayerUpdate,
    WaitingInit,
    GamePhaseChanged,
    HostConfirm,
    AvailableHostActionsChanged,
    PlayingTick,
    PlayingTickPayload,
    QuestionInitPayload,
    QuestionInit,
    CooldownInitPayload,
    CooldownInit,
    EndInit,
    HostLeft
} from "@domain/events/GameEvents.js";

import { GamePhase } from "@domain/phases/GamePhases.js";
import { GameRole } from "@domain/roles/GameRoles.js";
import { GameEventEmitter } from "@domain/events/GameEventEmitter.js";
import { Routine } from "@domain/contracts/Routine.js";
import { AnswerSubmission } from "../values/AnswerSubmission.js";
import { PlayerManager } from "../managers/PlayerManager.js";
import { QuestionManager } from "../managers/QuestionManager.js";
import { Timer } from "../managers/Timer.js";
import { AnswerSubmissionManager } from "../managers/AnswerSubmissionManager.js";
import { AnswerSubmissionFeedback } from "../values/AnswerSubmissionFeedback.js";
import { PhaseManager } from "../managers/PhaseManager.js";

export interface GameParameters {
    id: string;
    joinCode: string;
    quiz: Quiz;
    config: GameConfig;
}

export interface GameDependencies {
    phaseManager: PhaseManager;
    playerManager: PlayerManager;
    questionManager: QuestionManager;
    timer: Timer;
    answerSubmissionManager: AnswerSubmissionManager;
    gameManager: GameManager;
}


export class Game implements Routine {

    #id: string;
    #joinCode: string;
    #quiz: Quiz;

    #transitionTimeout: NodeJS.Timeout | null = null;

    #gameManager: GameManager;
    #answerSubmissionManager: AnswerSubmissionManager;
    #playerManager: PlayerManager;
    #questionManager: QuestionManager;
    #phaseManager: PhaseManager;
    #timer: Timer;
    #lastAccessed: number;
    #hasExpired: boolean = false;

    #expiryCheckInterval: NodeJS.Timeout | null = null;

    #eventEmitter: GameEventEmitter | null = null;

    constructor(parameters: GameParameters, dependencies: GameDependencies) {
        this.#id = parameters.id;
        this.#joinCode = parameters.joinCode;
        this.#quiz = parameters.quiz;
        this.#lastAccessed = Date.now();

        this.#gameManager = dependencies.gameManager;
        this.#answerSubmissionManager = dependencies.answerSubmissionManager;
        this.#playerManager = dependencies.playerManager;
        this.#questionManager = dependencies.questionManager;
        this.#timer = dependencies.timer;
        this.#phaseManager = dependencies.phaseManager;

        this.#phaseManager.phaseUpdateHandler = this.#emitPhaseUpdateGroup.bind(this);

        this.#gameManager.questionInitHandler = this.#emitQuestionInit.bind(this);
        this.#gameManager.cooldownInitHandler = this.#emitCooldownInit.bind(this);
        this.#gameManager.gameTickHandler = this.#gameTickLogic.bind(this);
        this.#gameManager.endInitHandler = this.#emitEndInit.bind(this);

        this.#playerManager.playerUpdateHandler = this.#emitPlayerUpdate.bind(this);
        this.#playerManager.hostLeftHandler = this.#emitHostLeft.bind(this);
        this.#playerManager.maxPlayerCount = parameters.config.players.max;

        this.#playerManager.startCleanupRoutine();

        this.#playerManager.playerUpdateHandler = this.#emitPlayerUpdate.bind(this);

        this.#expiryCheckInterval = setInterval(this.#expiryCheck.bind(this), 1000);

        this.#gameManager.init();
    }

    static create(parameters: GameParameters): Game {

        const phaseManager = new PhaseManager();
        const playerManager = new PlayerManager(phaseManager);

        const questionManager = new QuestionManager(parameters.quiz.questions);
        const timer = new Timer();

        const answerSubmissionManager = new AnswerSubmissionManager(
            playerManager,
            questionManager,
            timer,
            parameters.config.score
        );

        const gameManager = new GameManager(phaseManager, playerManager, questionManager, answerSubmissionManager, timer);

        const dependencies: GameDependencies = {
            phaseManager,
            playerManager,
            questionManager,
            timer,
            answerSubmissionManager,
            gameManager
        };

        return new Game(parameters, dependencies);
    }

    set eventEmitter(eventEmitter: GameEventEmitter) {
        if (this.#eventEmitter) {
            throw new Error("Event emitter already set");
        }
        this.#eventEmitter = eventEmitter;
    }

    get isExpired(): boolean {
        return this.#hasExpired;
    }

    get title(): string {
        return this.#quiz.title;
    }

    get questionCount(): number {
        return this.#quiz.questions.length;
    }

    get hasStarted(): boolean {
        return this.#phaseManager.hasStarted;
    }

    get isFull(): boolean {
        return this.#playerManager.isFull;
    }

    get id(): string {
        return this.#id;
    }

    get joinCode(): string {
        return this.#joinCode;
    }

    getPlayer(playerId: string): Player | null {
        return this.#playerManager.getPlayer(playerId);
    }

    removePlayer(player: Player): void {
        this.#playerManager.removePlayer(player);
    }

    join(player: Player): void {

        // First player is the host
        if (this.#playerManager.isEmpty) {
            player.addRole(GameRole.HOST);
        }

        this.#playerManager.addPlayer(player);

        this.#emitSyncEvent(player)
    }

    connectPlayer(connectionId: string, player: Player): void {
        this.#playerManager.connectPlayer(connectionId, player);
        this.#emitSyncEvent(player);

        if (this.#hasExpired) {
            this.#hasExpired = false;
        }

        this.#lastAccessed = Date.now();
    }

    disconnectPlayer(player: Player): void {
        this.#gameManager.disconnectPlayer(player);

        this.#emitPlayerUpdate();
        this.#emitHostActionsUpdate();

        if (this.#playerManager.connectedCount === 0 && this.#lastAccessed < (Date.now() - (1000 * 10))) {
            this.#hasExpired = true;
        }
    }

    /**
     * Game Drivers
     */

    start() {
        this.#gameManager.startGame();
    }

    end() {
        this.#gameManager.endGame();
    }

    requestNextQuestion() {
        if (!this.#phaseManager.isCooldown) {
            throw new Error("Game is not in cooldown phase");
        }

        this.#gameManager.requestNextQuestion();
    }

    submitAnswer(submission: AnswerSubmission): AnswerSubmissionFeedback {
        const feedback = this.#answerSubmissionManager.submitAnswer(submission);

        if (!feedback) throw new Error("Failed to submit answer");

        return feedback;
    }

    #expiryCheck(): void {
        if (this.#playerManager.connectedCount === 0 && this.#lastAccessed < (Date.now() - (1000 * 10))) {
            this.#hasExpired = true;
        }
    }

    #gameTickLogic(): void {

        if (this.#answerSubmissionManager.getSubmissionCount() === this.#playerManager.getPlayablePlayers().length) {
            this.#transitionTimeout = setTimeout(() => {
                this.#timer.reset();
                this.#gameManager.switchToCooldown();
            }, 1000);
        }

        this.#emitPlayingTick();
    }

    /**
     * Event Emitters
     */
    #emitHostLeft(): void {
        const event = new HostLeft();
        this.#emit(event, [GameRole.PLAYER]);
    }

    #emitPlayerUpdate(): void {
        const players = this.#playerManager.getPlayers();
        this.#emit(new PlayerUpdate(players), [GameRole.PLAYER]);
    }

    #emitWaitingInit(): void {
        const event = new WaitingInit(this.title, this.joinCode, this.questionCount);
        this.#emit(event, [GameRole.PLAYER]);
    }

    #emitEndInit(): void {
        const event = new EndInit({
            players: this.#playerManager.getPlayers(),
            reason: "Game Ended"
        });
        this.#emit(event, [GameRole.PLAYER]);
    }

    #emitPhaseUpdateGroup(): void {
        this.#emitPhaseUpdate();
        switch (this.#phaseManager.currentPhase) {
            case GamePhase.PLAYING:
                this.#emitQuestionInit();
                break;
            case GamePhase.COOLDOWN:
                this.#emitCooldownInit();
                break;
            case GamePhase.ENDED:
                this.#emitEndInit();
                break;
        }
        this.#emitPlayerUpdate(); // Make sure the players are shown once game has started
        this.#emitHostActionsUpdate();
    }

    #emitPhaseUpdate(): void {
        const event = new GamePhaseChanged(this.#phaseManager.currentPhase);
        this.#emit(event, [GameRole.PLAYER]);
    }

    #emitHostConfirm(): void {
        const event = new HostConfirm(true);
        this.#emit(event, [GameRole.HOST]);
    }

    #emitHostActionsUpdate(): void {
        const event = new AvailableHostActionsChanged(this.#getHostAvailableActions());
        this.#emit(event, [GameRole.HOST]);
    }

    #getHostAvailableActions(): {
        canStartGame: boolean;
        canGoToNextQuestion: boolean;
        canEndGame: boolean;
    } {
        return {
            canStartGame: this.#gameManager.canStartGame,
            canGoToNextQuestion: this.#gameManager.canGoToNextQuestion,
            canEndGame: this.#gameManager.canEndGame,
        };
    }

    #emitSyncEvent(player: Player): void {
        this.#emitPlayerUpdate();
        this.#emitWaitingInit();
        this.#emitPhaseUpdateGroup();

        if (player.roles.includes(GameRole.HOST)) {
            this.#emitHostConfirm();
        }
    }

    #emitPlayingTick(): void {
        const payload: PlayingTickPayload = {
            timeLeft: this.#timer.remainingTimeSec,
            answerCount: `${this.#answerSubmissionManager.getSubmissionCount()}/${this.#playerManager.getPlayablePlayers().length}`,
        };

        const event = new PlayingTick(payload);

        this.#emit(event, [GameRole.PLAYER]);
    }

    #emitQuestionInit(): void {
        const payload: QuestionInitPayload = {
            question: this.#questionManager.currentQuestion,
        };
        const event = new QuestionInit(payload);
        this.#emit(event, [GameRole.PLAYER]);
    }

    #emitCooldownInit(): void {
        const payload: CooldownInitPayload = {
            players: this.#playerManager.getPlayablePlayers(),
            correctAnswer: this.#questionManager.currentQuestion.answers.find(answer => answer.isCorrect)!
        };

        const event = new CooldownInit(payload);
        this.#emit(event, [GameRole.PLAYER]);
        this.#emitHostActionsUpdate();
    }

    #emit(event: GameEvent, scope: GameRole[]): void {
        if (this.#eventEmitter) {
            const metadata: GameEventMetadata = {
                gameId: this.#id,
                roles: scope,
                emittedAt: Date.now(),
            };
            this.#eventEmitter.emit(metadata, event);
        }
    }

    destroy(): void {
        // Clean up all routines
        this.#playerManager.destroy();
        this.#timer.destroy();

        if (this.#expiryCheckInterval) {
            clearInterval(this.#expiryCheckInterval);
        }

        if (this.#transitionTimeout) {
            clearTimeout(this.#transitionTimeout);
        }
    }
}