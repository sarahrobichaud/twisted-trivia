import { AnswerSubmissionFeedback } from "@domain/values/AnswerSubmissionFeedback.js";
import { AnswerSubmission } from "@domain/values/AnswerSubmission.js";
export interface GameCommandGateway {
    handleStartGame(gameId: string): Promise<void>;
    handleSubmitAnswer(submission: AnswerSubmission): Promise<AnswerSubmissionFeedback>;
    handleNextQuestion(gameId: string): Promise<void>;
    handleEndGame(gameId: string): Promise<void>;
}



