import { PrismaClient } from "@prisma/client";

import { QuizRepository } from "@domain/contracts/repositories/QuizRepository.js";
import { Quiz } from "@domain/entities/Quiz.js";
import { QuizMapper } from "../../mappers/EntityMappers.js";

export class PrismaQuizRepository implements QuizRepository {
    constructor(private readonly prisma: PrismaClient) { }

    async findById(id: string): Promise<Quiz | null> {

        const quiz = await this.prisma.quiz.findUnique({
            where: { id },
            include: {
                questions: {
                    include: {
                        choices: true
                    }
                }
            },
        });

        if (!quiz) return null;

        return QuizMapper.toDomain(quiz);
    }


    async findAll(): Promise<Quiz[]> {
        const quizzes = await this.prisma.quiz.findMany({
            include: {
                questions: {
                    include: {
                        choices: true
                    }
                }
            }
        });

        return quizzes.map(QuizMapper.toDomain);
    }
}

