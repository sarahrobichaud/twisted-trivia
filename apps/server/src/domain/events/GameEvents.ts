import { GamePhase } from "@domain/phases/GamePhases.js";
import { Player } from "../entities/Player.js";
import { GameRole } from "../roles/GameRoles.js";
import { Answer } from "@domain/entities/Answer.js";
import { Question } from "../entities/Question.js";
import { CurrentQuestionInfo } from "../managers/QuestionManager.js";


export abstract class Serializable {
    abstract serialize(): any;
}

export interface GameEvent {
    type: string;
    payload: any;
}

export interface GameEventMetadata {
    gameId: string;
    roles: GameRole[];
    emittedAt: number;
}

export type GameEventHandler = (metadata: GameEventMetadata, event: GameEvent) => void;

export class GamePhaseChanged implements GameEvent {
    type = "phaseUpdate";
    payload: {
        activePhase: GamePhase;
    };
    constructor(activePhase: GamePhase) {
        this.payload = { activePhase };
    }
}

export interface AvailableHostActionsPayload {
    canStartGame: boolean;
    canGoToNextQuestion: boolean;
    canEndGame: boolean;
}

export class AvailableHostActionsChanged implements GameEvent {
    type = "hostActionsUpdate";
    payload: AvailableHostActionsPayload;
    constructor(payload: AvailableHostActionsPayload) {
        this.payload = payload;
    }
}

export class HostConfirm implements GameEvent {
    type = "hostConfirm";
    payload: {
        isHost: boolean;
    };
    constructor(isHost: boolean) {
        this.payload = { isHost };
    }
}

export interface QuestionInitPayload {
    question: CurrentQuestionInfo;
}

export class QuestionInit extends Serializable implements GameEvent {
    type = "questionInit";
    payload: QuestionInitPayload;

    constructor(payload: QuestionInitPayload) {
        super();
        this.payload = payload;
    }

    serialize() {
        return {
            choices: this.payload.question.answers.map(answer => answer.toListDTO()),
            questionNumber: this.payload.question.number,
            question: { id: this.payload.question.id, content: this.payload.question.content }
        };
    }
}

export interface CooldownInitPayload {
    players: Player[];
    correctAnswer: Answer;
}

export class CooldownInit extends Serializable implements GameEvent {
    type = "cooldownInit";
    payload: CooldownInitPayload;

    constructor(payload: CooldownInitPayload) {
        super();
        this.payload = payload;
    }

    serialize() {
        const sortedPlayers = this.payload.players.sort((a, b) => b.score - a.score);

        const players = sortedPlayers.map((player, index) => player.toListDTO(index + 1));

        return {
            players,
            correctAnswer: this.payload.correctAnswer.content
        };
    }
}

export interface EndInitPayload {
    players: Player[];
    reason: string;
}

export class EndInit extends Serializable implements GameEvent {
    type = "endInit";
    payload: EndInitPayload;

    constructor(payload: EndInitPayload) {
        super();
        this.payload = payload;
    }

    serialize() {
        return {
            players: this.payload.players.map((player, index) => player.toListDTO(index + 1)).sort((a, b) => b.score - a.score),
            reason: this.payload.reason
        };
    }
}

export interface PlayingTickPayload {
    timeLeft: number;
    answerCount: string;
}

export class PlayingTick implements GameEvent {
    type = "questionTick";
    payload: PlayingTickPayload;
    constructor(payload: PlayingTickPayload) {
        this.payload = payload;
    }
}


export class PlayerUpdate extends Serializable implements GameEvent {
    type = "playerUpdate";
    payload: {
        players: Player[];
    };

    constructor(players: Player[]) {
        super();
        this.payload = { players };
    }

    serialize() {
        return {
            players: this.payload.players.map((player, index) => player.toListDTO(index + 1)).sort((a, b) => b.score - a.score)
        };
    }
}

export class WaitingInit implements GameEvent {
    type = "waitingInit";
    payload: {
        title: string;
        joinCode: string;
        questionCount: number;
    };
    constructor(title: string, joinCode: string, questionCount: number) {
        this.payload = { title, joinCode, questionCount };
    }
}

export class HostLeft implements GameEvent {
    type = "hostLeft";
    payload: undefined;
    constructor() {
        this.payload = undefined;
    }
}
