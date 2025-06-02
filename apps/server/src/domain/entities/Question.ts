import { Answer } from "@domain/entities/Answer.js";

export class Question {
    #id: string;
    #content: string;
    #point: number;
    #choices: Answer[];
    #quizId: string;
    #timeLimitSeconds: number;

    constructor(id: string, quizId: string, content: string, point: number, timeLimitSeconds: number, choices: Answer[]) {
        this.#id = id;
        this.#quizId = quizId;
        this.#content = content;
        this.#point = point;
        this.#timeLimitSeconds = timeLimitSeconds;
        this.#choices = choices;
    }

    static create(quizId: string, content: string, point: number, timeLimitSeconds: number, choices: Answer[]): Question {
        return new Question(crypto.randomUUID(), quizId, content, point, timeLimitSeconds, choices);
    }

    static reconstruct(id: string, quizId: string, content: string, point: number, timeLimitSeconds: number, choices: Answer[]): Question {
        return new Question(id, quizId, content, point, timeLimitSeconds, choices);
    }

    get id(): string {
        return this.#id;
    }

    get quizId(): string {
        return this.#quizId;
    }

    get content(): string {
        return this.#content;
    }

    get point(): number {
        return this.#point;
    }

    get timeLimitSeconds(): number {
        return this.#timeLimitSeconds;
    }

    get choices(): Answer[] {
        return this.#choices;
    }

    get answer(): Answer {
        const correctAnswer = this.#choices.find(choice => choice.isCorrect);

        if (!correctAnswer) {
            throw new Error("No correct answer found for question " + this.#id);
        }

        return correctAnswer;
    }
}
