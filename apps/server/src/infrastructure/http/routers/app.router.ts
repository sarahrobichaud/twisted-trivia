import { AppRouter } from "@bayfront/http/Router.js";
import { HttpMethod, RouterEntry } from "@bayfront/types/shared.js";
import { GameController } from "~/presentation/controllers/game.controller.js";
import { HomeController } from "~/presentation/controllers/home.controller.js";

export class TriviaAppRouter extends AppRouter {

    override setup() {
        return {
            routes: [
                {
                    path: "/room/:gameID",
                    method: HttpMethod.GET,
                    action: this.handler(GameController, 'serveGame')
                },
                {
                    path: "/",
                    method: HttpMethod.GET,
                    action: this.handler(HomeController, "index")
                },
                {
                    path: "/join",
                    method: HttpMethod.GET,
                    action: this.handler(HomeController, 'join')
                }
            ]
        } satisfies RouterEntry;
    }

}   