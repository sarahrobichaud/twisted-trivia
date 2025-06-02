import { Quiz } from "@domain/entities/Quiz.js";
import { Question } from "@domain/entities/Question.js";
import { Answer } from "@domain/entities/Answer.js";

import type { QuizPersistenceModel, AnswerPersistenceModel, QuestionPersistenceModel } from "~/infrastructure/models/PersistenceModel.js";


export class QuizMapper {
    static toPersistence(quiz: Quiz): QuizPersistenceModel {
        return {
            id: quiz.id,
            title: quiz.title,
            description: quiz.description,
            questions: quiz.questions.map((question) => QuestionMapper.toPersistence(question)),
        };
    }

    static toDomain(persistence: QuizPersistenceModel): Quiz {
        return Quiz.reconstruct(
            persistence.id,
            persistence.title,
            persistence.description,
            persistence.questions.map(QuestionMapper.toDomain)
        );
    }
}

export class QuestionMapper {
    static toPersistence(question: Question): QuestionPersistenceModel {
        return {
            id: question.id,
            quizId: question.quizId,
            content: question.content,
            point: question.point,
            timeLimitSeconds: question.timeLimitSeconds,
            choices: question.choices.map(AnswerMapper.toPersistence)
        };
    }

    static toDomain(persistence: QuestionPersistenceModel): Question {
        return Question.reconstruct(
            persistence.id,
            persistence.quizId,
            persistence.content,
            persistence.point,
            persistence.timeLimitSeconds,
            persistence.choices.map(AnswerMapper.toDomain)
        );
    }
}

export class AnswerMapper {
    static toPersistence(answer: Answer): AnswerPersistenceModel {
        return {
            id: answer.id,
            questionId: answer.questionId,
            isCorrect: answer.isCorrect,
            content: answer.content,
        }
    }

    static toDomain(persistence: AnswerPersistenceModel): Answer {
        return Answer.reconstruct(
            persistence.id,
            persistence.questionId,
            persistence.isCorrect,
            persistence.content,
        );
    }
}
