export interface AnswerFeedbackLegacyDTO {
    isCorrect: boolean;
    multiplier: number;
    timeToAnswer: number;
}

export class AnswerSubmissionFeedback {
    #wasCorrect: boolean;
    #multiplier: number;
    #timeTakenMS: number;
    #points: number;

    constructor(wasCorrect: boolean, multiplier: number, timeTakenMS: number, points: number) {
        this.#wasCorrect = wasCorrect;
        this.#multiplier = multiplier;
        this.#timeTakenMS = timeTakenMS;
        this.#points = points;
    }

    get wasCorrect(): boolean {
        return this.#wasCorrect;
    }

    get timeTakenMS(): number {
        return this.#timeTakenMS;
    }

    get multiplier(): number {
        return this.#multiplier;
    }

    get points(): number {
        return this.#points;
    }

    toLegacyDTO(): AnswerFeedbackLegacyDTO {
        return {
            isCorrect: this.wasCorrect,
            multiplier: this.multiplier,
            timeToAnswer: this.timeTakenMS,
        };
    }
}

