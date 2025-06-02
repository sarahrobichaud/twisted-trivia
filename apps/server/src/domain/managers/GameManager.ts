import { GameConfig } from "../contracts/configuration/GameConfigs.js";
import { Routine } from "../contracts/Routine.js";
import { Player } from "../entities/Player.js";
import { GamePhase } from "../phases/GamePhases.js";
import { AnswerSubmissionManager } from "./AnswerSubmissionManager.js";
import { PhaseManager } from "./PhaseManager.js";
import { PlayerManager } from "./PlayerManager.js";
import { CurrentQuestionInfo, QuestionManager } from "./QuestionManager.js";
import { Timer } from "./Timer.js";

export class GameManager {

    #phaseManager: PhaseManager;
    #questionManager: QuestionManager;
    #playerManager: PlayerManager;

    #answerSubmissionManager: AnswerSubmissionManager;
    #timer: Timer;

    #questionInitHandler: (() => void) | null = null;
    #cooldownInitHandler: (() => void) | null = null;
    #endInitHandler: (() => void) | null = null;
    #gameTickHandler: (() => void) | null = null;

    constructor(phaseManager: PhaseManager, playerManager: PlayerManager, questionManager: QuestionManager, answerSubmissionManager: AnswerSubmissionManager, timer: Timer) {
        this.#phaseManager = phaseManager;
        this.#playerManager = playerManager;
        this.#questionManager = questionManager;
        this.#answerSubmissionManager = answerSubmissionManager;
        this.#timer = timer;
    }

    /**
     * Event Handlers
     */

    set questionInitHandler(handler: () => void) {
        this.#questionInitHandler = handler;
    }

    set cooldownInitHandler(handler: () => void) {
        this.#cooldownInitHandler = handler;
    }

    set gameTickHandler(handler: () => void) {
        this.#gameTickHandler = handler;
    }

    set endInitHandler(handler: () => void) {
        this.#endInitHandler = handler;
    }

    /**
     * Game Information
     */
    get currentQuestion(): CurrentQuestionInfo {
        return this.#questionManager.currentQuestion;
    }

    get remainingTime(): number {
        return this.#timer.remainingTimeSec;
    }

    get isTimeUp(): boolean {
        return this.#phaseManager.currentPhase === GamePhase.PLAYING && this.#timer.isTimeUp;
    }

    get answeredCount(): number {
        return this.#playerManager.answeredCount;
    }


    /**
     * Host actions
     */

    get canGoToNextQuestion(): boolean {
        return this.#phaseManager.isCooldown && !this.#questionManager.isLastQuestion;
    }

    get canStartGame(): boolean {
        return this.#phaseManager.isWaiting && this.#playerManager.connectedPlayerCount >= 1;
    }

    get canEndGame(): boolean {
        return this.#phaseManager.isCooldown && this.#questionManager.isLastQuestion
    }

    /*
     * Player Management Pass-through
     */

    addPlayer(player: Player): void {
        this.#playerManager.addPlayer(player);
    }

    connectPlayer(connectionId: string, player: Player): void {
        this.#playerManager.connectPlayer(connectionId, player);
    }

    disconnectPlayer(player: Player): void {

        if (this.#phaseManager.isEnded) {
            this.#playerManager.disconnectPlayer(player);
            return;
        }

        this.#playerManager.saveEndResult();

        this.#playerManager.disconnectPlayer(player);

        if (this.#playerManager.onlyHostLeft) {
            this.switchToEnd();
        } else {
            this.#playerManager.resetEndResult();
        }
    }

    getPlayer(playerId: string): Player | null {
        return this.#playerManager.getPlayer(playerId);
    }

    getPlayers(): Player[] {
        return this.#playerManager.getPlayers();
    }

    getPlayablePlayers(): Player[] {
        return this.#playerManager.getPlayablePlayers();
    }

    /**
     * Game Management
     */

    init() {

        if (!this.#questionInitHandler) {
            throw new Error("Question init handler not set");
        }

        if (!this.#cooldownInitHandler) {
            throw new Error("Cooldown init handler not set");
        }

        if (!this.#gameTickHandler) {
            throw new Error("Game tick handler not set");
        }

        if (!this.#endInitHandler) {
            throw new Error("End init handler not set");
        }

        this.#timer.onTickHandler = this.#gameTickHandler;
        this.#timer.onTimerEndHandler = this.switchToCooldown.bind(this);
    }


    startGame() {
        if (!this.#phaseManager.isWaiting) {
            throw new Error("Game is not in waiting phase");
        }

        this.#questionManager.reset();
        this.goToQuestion();
    }

    endGame() {
        this.#playerManager.saveEndResult();
        this.switchToEnd();
    }

    goToQuestion() {
        this.#questionManager.nextQuestion();
        this.#phaseManager.setCurrentPhase(GamePhase.PLAYING);
        this.#timer.startTimer(this.currentQuestion.timeLimitMS);
        this.#questionInitHandler?.();
    }

    requestNextQuestion() {
        if (!this.#phaseManager.isCooldown) {
            throw new Error("Game is not in cooldown phase");
        }

        if (this.#questionManager.isLastQuestion) {
            this.switchToEnd();
            return;
        }

        this.goToQuestion();
    }

    switchToWaiting() {
        this.#phaseManager.setCurrentPhase(GamePhase.WAITING);
    }

    switchToCooldown() {
        this.#answerSubmissionManager.clearSubmissions();
        this.#phaseManager.setCurrentPhase(GamePhase.COOLDOWN);
    }

    switchToEnd() {
        this.#timer.reset();
        this.#phaseManager.setCurrentPhase(GamePhase.ENDED);
        this.#endInitHandler?.();
    }
}


