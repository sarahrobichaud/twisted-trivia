import { Quiz } from "~/domain/entities/Quiz.js";
export interface QuizService {
    getByID(quizID: string): Promise<Quiz | null>;
    getAll(): Promise<Quiz[]>;
}


