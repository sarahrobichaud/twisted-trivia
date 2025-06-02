import { Question } from "@domain/entities/Question.js";

export class Quiz {

    #id: string;
    #title: string;
    #description: string;

    #questions: Question[];

    constructor(
        id: string,
        title: string,
        description: string,
        questions: Question[],
    ) {
        this.#id = id;
        this.#title = title;
        this.#description = description;
        this.#questions = questions;
    }

    static create(title: string, description: string, questions: Question[]): Quiz {
        return new Quiz(crypto.randomUUID(), title, description, questions);
    }

    static reconstruct(
        id: string,
        title: string,
        description: string,
        questions: Question[] = [],
    ) {
        return new Quiz(id, title, description, questions);
    }

    get id(): string {
        return this.#id;
    }

    set id(id: string) {
        this.#id = id;
    }

    get title(): string {
        return this.#title;
    }

    set title(title: string) {
        this.#title = title;
    }

    get description(): string {
        return this.#description;
    }

    set description(description: string) {
        this.#description = description;
    }

    get questions(): Question[] {
        return this.#questions;
    }

    set questions(questions: Question[]) {
        this.#questions = questions;
    }
}