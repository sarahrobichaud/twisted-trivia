import { GameRepository } from "~/domain/contracts/repositories/GameRepository.js";
import { GameCommandService } from "~/domain/contracts/services/GameCommandService.js";
import { AnswerSubmission } from "~/domain/values/AnswerSubmission.js";
import { AnswerSubmissionFeedback } from "~/domain/values/AnswerSubmissionFeedback.js";

export class DefaultGameCommandService implements GameCommandService {

    #gameRepository: GameRepository;

    constructor(gameRepository: GameRepository) {
        this.#gameRepository = gameRepository;
    }

    async endGame(gameId: string): Promise<void> {
        const game = await this.#gameRepository.findById(gameId);

        if (!game) {
            throw new Error("Game not found");
        }

        game.end();
    }

    async submitAnswer(submission: AnswerSubmission): Promise<AnswerSubmissionFeedback> {
        const game = await this.#gameRepository.findById(submission.gameId);

        if (!game) {
            throw new Error("Game not found");
        }

        return game.submitAnswer(submission);
    }

    async nextQuestion(gameId: string): Promise<void> {

        const game = await this.#gameRepository.findById(gameId);

        if (!game) {
            throw new Error("Game not found");
        }

        game.requestNextQuestion();
    }

    async startGame(gameId: string): Promise<void> {

        const game = await this.#gameRepository.findById(gameId);

        if (!game) {
            throw new Error("Game not found");
        }

        game.start();
    }

}
