import { QuizService } from "@domain/contracts/services/QuizServiceContract.js";
import { QuizRepository } from "~/domain/contracts/repositories/QuizRepository.js";
import { Quiz } from "~/domain/entities/Quiz.js";

export class DefaultQuizService implements QuizService {

    #quizRepository: QuizRepository;

    constructor(quizRepository: QuizRepository) {
        this.#quizRepository = quizRepository;
    }

    async getByID(quizID: string): Promise<Quiz | null> {
        return this.#quizRepository.findById(quizID);
    }

    async getAll(): Promise<Quiz[]> {
        return this.#quizRepository.findAll();
    }
}   