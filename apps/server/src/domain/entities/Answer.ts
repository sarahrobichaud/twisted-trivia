import { Question } from "@prisma/client";
import { AnswerPersistenceModel } from "~/infrastructure/models/PersistenceModel.js";

export class Answer {
    #id: string;

    #questionId: string;

    #isCorrect: boolean;

    #content: string;

    constructor(
        id: string,
        questionId: string,
        isCorrect: boolean,
        content: string,
    ) {
        this.#id = id;
        this.#questionId = questionId;
        this.#isCorrect = isCorrect;
        this.#content = content;
    }

    static reconstruct(
        id: string,
        questionId: string,
        isCorrect: boolean,
        content: string,
    ) {
        return new Answer(id, questionId, isCorrect, content);
    }

    static create(questionId: string, isCorrect: boolean, content: string): Answer {
        return new Answer(crypto.randomUUID(), questionId, isCorrect, content);
    }

    get id(): string {
        return this.#id;
    }

    get questionId(): string {
        return this.#questionId;
    }

    get isCorrect(): boolean {
        return this.#isCorrect;
    }

    get content(): string {
        return this.#content;
    }

    toListDTO(): { id: string, text: string } {
        return {
            id: this.#id,
            text: this.#content,
        };
    }
}
