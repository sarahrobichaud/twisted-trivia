import { AnswerSubmissionFeedback } from "./AnswerSubmissionFeedback.js";

export interface ScoreParams {
    basePoints: number;
    isCorrect: boolean;
    timeElapsedMS: number;
    maxTimeMS: number;
    maxMultiplier: number;
    minMultiplier: number;
}

export class ScoreCalculator {

    static #calculateMultiplier(params: ScoreParams) {

        if (!params.isCorrect) return 0;

        if (params.timeElapsedMS >= params.maxTimeMS / 2) {
            return Math.round(params.minMultiplier * 100) / 100;
        }

        const MAX_MULTIPLIER = params.maxMultiplier;
        const MIN_MULTIPLIER = params.minMultiplier;

        // Linear interpolation
        const distance = params.timeElapsedMS / params.maxTimeMS;
        const multiplier = MAX_MULTIPLIER - (distance) * (MAX_MULTIPLIER - MIN_MULTIPLIER);

        return Math.round(Math.max(MIN_MULTIPLIER, Math.min(MAX_MULTIPLIER, multiplier)) * 100) / 100;
    }

    static calculateScore(params: ScoreParams): AnswerSubmissionFeedback {

        const multiplier = this.#calculateMultiplier(params);
        const score = Math.round(params.basePoints * multiplier);

        return new AnswerSubmissionFeedback(params.isCorrect, multiplier, params.timeElapsedMS, score);
    }
}


