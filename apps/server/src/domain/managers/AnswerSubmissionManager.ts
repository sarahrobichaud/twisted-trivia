import { GameConfig } from "../contracts/configuration/GameConfigs.js";
import { AnswerSubmission } from "../values/AnswerSubmission.js";
import { AnswerSubmissionFeedback } from "../values/AnswerSubmissionFeedback.js";
import { ScoreCalculator } from "../values/ScoreCalculator.js";
import { PlayerManager } from "./PlayerManager.js";
import { QuestionManager } from "./QuestionManager.js";
import { Timer } from "./Timer.js";

export class AnswerSubmissionManager {
    #playerManager: PlayerManager;
    #questionManager: QuestionManager;
    #submissions: Map<string, { submission: AnswerSubmission, feedback: AnswerSubmissionFeedback }> = new Map();
    #timer: Timer;
    #config: GameConfig['score'];


    constructor(playerManager: PlayerManager, questionManager: QuestionManager, timer: Timer, config: GameConfig['score']) {
        this.#playerManager = playerManager;
        this.#questionManager = questionManager;
        this.#timer = timer;
        this.#config = config;
    }

    submitAnswer(submission: AnswerSubmission): AnswerSubmissionFeedback | null {
        const player = this.#playerManager.getPlayer(submission.playerId);

        if (!player || player.hasAnswered) return null;

        const currentQuestion = this.#questionManager.currentQuestion;

        const isCorrect = currentQuestion.answers.some(
            a => a.id === submission.answerId && a.isCorrect
        );

        const feedback = ScoreCalculator.calculateScore({
            basePoints: currentQuestion.points,
            isCorrect,
            timeElapsedMS: this.#getTimeElapsed(),
            maxTimeMS: currentQuestion.timeLimitMS,
            maxMultiplier: this.#config.maxMultiplier,
            minMultiplier: this.#config.minMultiplier
        });

        player.hasAnswered = true;
        this.#submissions.set(player.id, { submission, feedback });

        player.addScore(feedback.points);

        return feedback;
    }

    getSubmissionCount(): number {
        return this.#submissions.size;
    }

    getFeedback(playerId: string): AnswerSubmissionFeedback | null {
        return this.#submissions.get(playerId)?.feedback ?? null;
    }

    clearSubmissions(): void {
        this.#submissions.clear();
        this.#playerManager.resetPlayerAnswers();
    }

    #getTimeElapsed(): number {
        return this.#timer.elapsedTimeMs;
    }
}
