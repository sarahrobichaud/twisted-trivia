import { Socket } from "socket.io";
import { GameCommandGateway } from "~/application/gateways/inbound/GameCommandGateway.js";
import { GameCommandPayload, GameCommandType } from "~/domain/commands/GameCommands.js";
import { GameCommandService } from "~/domain/contracts/services/GameCommandService.js";
import { AnswerSubmission } from "~/domain/values/AnswerSubmission.js";
import { AnswerFeedbackLegacyDTO, AnswerSubmissionFeedback } from "~/domain/values/AnswerSubmissionFeedback.js";

export class SocketIOGameCommandHandler implements GameCommandGateway {

    #gameCommandService: GameCommandService;

    constructor(gameCommandService: GameCommandService) {
        this.#gameCommandService = gameCommandService;
    }

    initializeListeners(socket: Socket) {
        socket.on(GameCommandType.START_GAME, async () => {
            try {
                await this.handleStartGame(socket.data.gameId);
            } catch (error) {
                console.error("Error starting game", error);
                socket.emit("error", { message: "Failed to start game" });
            }
        });

        socket.on(GameCommandType.SUBMIT_ANSWER, async (
            answerId: GameCommandPayload[typeof GameCommandType.SUBMIT_ANSWER],
            callback: (feedback: AnswerFeedbackLegacyDTO) => void
        ) => {
            try {
                const { gameId, playerId } = socket.data;

                const submission = new AnswerSubmission(playerId, answerId, gameId);

                const feedback = await this.handleSubmitAnswer(submission);

                callback(feedback.toLegacyDTO());
            } catch (error) {
                console.error("Error submitting answer", error);
                socket.emit("error", { message: "Failed to submit answer" });
            }
        });

        socket.on(GameCommandType.NEXT_QUESTION, async () => {
            try {
                await this.handleNextQuestion(socket.data.gameId);
            } catch (error) {
                console.error("Error going to next question", error);
                socket.emit("error", { message: "Failed to go to next question" });
            }
        });

        socket.on(GameCommandType.END_GAME, async () => {
            try {
                await this.handleEndGame(socket.data.gameId);
            } catch (error) {
                console.error("Error ending game", error);
                socket.emit("error", { message: "Failed to end game" });
            };

        })
    }

    async handleStartGame(gameId: string): Promise<void> {
        return this.#gameCommandService.startGame(gameId);
    }

    async handleSubmitAnswer(submission: AnswerSubmission): Promise<AnswerSubmissionFeedback> {
        return this.#gameCommandService.submitAnswer(submission);
    }

    async handleNextQuestion(gameId: string): Promise<void> {
        return this.#gameCommandService.nextQuestion(gameId);
    }

    async handleEndGame(gameId: string): Promise<void> {
        return this.#gameCommandService.endGame(gameId);
    }
}