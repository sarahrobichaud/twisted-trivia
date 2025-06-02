import { AnswerSubmissionFeedback } from "../values/AnswerSubmissionFeedback.js";

export type GameCommand = {
    type: GameCommandType;
    payload: GameCommandPayload[GameCommandType];
    metadata?: {
        playerId: string;
        gameId: string;
        timestamp: number;
    };
};

export const GameCommandType = {
    START_GAME: 'startGame',
    SUBMIT_ANSWER: 'answerQuestion',
    NEXT_QUESTION: 'nextQuestion',
    END_GAME: 'endGame',
} as const;

export type GameCommandType = typeof GameCommandType[keyof typeof GameCommandType];

export type GameCommandPayload = {
    [GameCommandType.START_GAME]: StartGameCommandPayload;
    [GameCommandType.SUBMIT_ANSWER]: SubmitAnswerCommandPayload;
    [GameCommandType.NEXT_QUESTION]: NextQuestionCommandPayload;
    [GameCommandType.END_GAME]: EndGameCommandPayload;
};

type StartGameCommandPayload = undefined;

type SubmitAnswerCommandPayload = string;

type NextQuestionCommandPayload = undefined;

type EndGameCommandPayload = undefined;
