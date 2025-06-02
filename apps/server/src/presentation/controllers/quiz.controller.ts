import { Request, Response } from "express";
import { QuizResponseMapper } from "@presentation/mapper/ResponseMapper.js";

import { AppController } from "@bayfront/http/Controller.js";
import { HttpException } from "@bayfront/errors/HttpException.js";

export class QuizController extends AppController {

    async getAll(req: Request, res: Response) {

        const quizzes = await this.services.quiz.getAll();

        const response = quizzes.map(QuizResponseMapper.toInfoDTO);

        return res.success(response, "Quizzes fetched successfully");
    }

    async getById(req: Request, res: Response) {

        if (!req.params.id) {
            throw HttpException.BadRequest("Quiz ID is required");
        }

        const quiz = await this.services.quiz.getByID(req.params.id);

        if (!quiz) {
            throw HttpException.NotFound("Quiz not found");
        }

        const response = QuizResponseMapper.toInfoDTO(quiz);

        return res.success(response, "Quiz fetched successfully");
    }

    async delete(req: Request, res: Response) {
        throw HttpException.NotImplemented();
    }
}
