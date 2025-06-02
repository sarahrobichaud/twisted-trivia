import { Question } from "@domain/entities/Question.js";
import { Answer } from "@domain/entities/Answer.js";

export interface CurrentQuestionInfo {
    id: string;
    answers: Answer[];
    content: string;
    number: number;
    timeLimitMS: number;
    points: number;
}

export class QuestionManager {

    #questions: Question[];
    #currentQuestionIndex: number;

    constructor(questions: Question[]) {
        this.#questions = questions;
        this.#currentQuestionIndex = -1;
    }

    get currentQuestion(): CurrentQuestionInfo {
        const question = this.#questions[this.#currentQuestionIndex];

        return {
            id: question.id,
            answers: question.choices,
            content: question.content,
            number: this.#currentQuestionIndex + 1,
            timeLimitMS: question.timeLimitSeconds * 1000,
            points: question.point
        };
    }

    get isLastQuestion(): boolean {
        return this.#currentQuestionIndex === this.#questions.length - 1;
    }

    nextQuestion(): void {
        this.#currentQuestionIndex++;
    }

    reset(): void {
        this.#currentQuestionIndex = -1;
    }
}