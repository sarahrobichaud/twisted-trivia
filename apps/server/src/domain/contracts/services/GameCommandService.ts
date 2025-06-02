import { AnswerSubmission } from "~/domain/values/AnswerSubmission.js";
import { AnswerSubmissionFeedback } from "~/domain/values/AnswerSubmissionFeedback.js";

export interface GameCommandService {
    submitAnswer(submission: AnswerSubmission): Promise<AnswerSubmissionFeedback>;
    nextQuestion(gameId: string): Promise<void>;
    startGame(gameId: string): Promise<void>;
    endGame(gameId: string): Promise<void>;
}