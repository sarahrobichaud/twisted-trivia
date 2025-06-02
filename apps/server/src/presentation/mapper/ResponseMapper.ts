import { Quiz } from "@domain/entities/Quiz.js";
import { QuizInfoDTO } from "../dtos/QuizInfoDTO.js";

export class QuizResponseMapper {
    static toInfoDTO(quiz: Quiz): QuizInfoDTO {
        return {
            id: quiz.id,
            title: quiz.title,
            description: quiz.description,
            questionCount: quiz.questions.length
        }
    }
}
