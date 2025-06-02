import { Request, Response } from "express";
import { AppController } from "@bayfront/http/Controller.js";

export class HomeController extends AppController {


    async index(req: Request, res: Response) {
        const quizzes = await this.services.quiz.getAll();

        res.render("index", {
            title: "Realtime Trivia Quiz",
            quizzes,
            showJoinButton: true,
            isLobby: true,
        });
    }

    async join(req: Request, res: Response) {
        res.render("join", {
            title: "Realtime Trivia Quiz",
            showJoinButton: false,
            isLobby: true,
        });
    }
}