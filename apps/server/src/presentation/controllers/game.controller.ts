import { Request, Response, NextFunction } from "express";
import { AppController } from "@bayfront/http/Controller.js";
import { HttpException } from "@bayfront/errors/HttpException.js";

export class GameController extends AppController {


    async createGame(req: Request, res: Response, next: NextFunction) {

        const { quizID } = req.params;

        if (!quizID) {
            throw HttpException.BadRequest("Quiz ID is required");
        }

        const quiz = await this.services.quiz.getByID(quizID);

        if (!quiz) {
            throw HttpException.NotFound("Quiz not found");
        }

        const authorization = await this.services.game.createGame(quiz);

        const response = {
            joinCode: authorization.game.joinCode,
            accessCode: authorization.accessToken
        }

        return res.success(response, "Created game successfully");
    }


    async joinGame(req: Request, res: Response, next: NextFunction) {
        const { joinCode } = req.params;

        if (!joinCode) {
            throw HttpException.BadRequest("Join code is required");
        }

        const game = await this.services.game.getByJoinCode(joinCode);

        if (!game) {
            throw HttpException.Unauthorized("Invalid join code");
        }


        const authorization = await this.services.game.joinGame(game);

        const response = {
            joinCode: authorization.game.joinCode,
            accessCode: authorization.accessToken
        }

        return res.success(response, "Joined game successfully");
    }

    async connect(req: Request, res: Response, next: NextFunction) {
        const { joinCode } = req.params;
        const { username } = req.body;

        if (!joinCode) {
            throw HttpException.BadRequest("Join code is required");
        }

        if (!username) {
            throw HttpException.BadRequest("Username is required");
        }

        const token = req.headers["x-access-code"];

        if (!token || typeof token !== "string") {
            throw HttpException.Unauthorized("Access code is required");
        }


        const game = await this.services.game.getByJoinCode(joinCode);

        if (!game) {
            throw HttpException.Unauthorized("Invalid access code");
        }

        const player = await this.services.gameConnection.authenticate(game.id, token);

        if (!player) {
            throw HttpException.Unauthorized("Invalid access code");
        }

        player.username = username;

        const clientURL = new URL(process.env.CLIENT_URL!);

        clientURL.pathname = `/app/room/${game.id}`;

        clientURL.searchParams.set("code", player.accessToken);

        return res.success({
            url: clientURL.toString()
        }, "Requested game connection URL successfully");
    }

    async serveGame(req: Request, res: Response, next: NextFunction) {
        const { gameID } = req.params;

        if (!gameID) {
            throw HttpException.BadRequest("Game ID is required");
        }

        const game = await this.services.game.getByID(gameID);

        if (!game) {
            throw HttpException.NotFound("Game not found");
        }

        return res.status(200).render('game', {
            isGame: true,
            title: game.title,
            questionCount: game.questionCount
        });
    }

}
