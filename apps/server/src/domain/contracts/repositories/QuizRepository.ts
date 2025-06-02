import { Quiz } from "@domain/entities/Quiz.js";

export interface QuizRepository {
    findById(id: string): Promise<Quiz | null>;

    findAll(): Promise<Quiz[]>;
}

