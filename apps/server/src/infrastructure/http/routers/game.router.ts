import { AppRouter } from "@bayfront/http/Router.js";
import { HttpMethod, RouterEntry } from "@bayfront/types/shared.js";
import { GameController } from "~/presentation/controllers/game.controller.js";


export class GameRouter extends AppRouter {

    override setup() {
        return {
            routes: [
                {
                    path: "/create/:quizID",
                    method: HttpMethod.POST,
                    action: this.handler(GameController, 'createGame'),
                },
                {
                    path: "/join/:joinCode",
                    method: HttpMethod.POST,
                    action: this.handler(GameController, 'joinGame'),
                },
                {
                    path: "/connect/:joinCode",
                    method: HttpMethod.POST,
                    action: this.handler(GameController, 'connect'),
                }
            ]
        } satisfies RouterEntry;
    }

}

