import { HttpMethod, RouterEntry } from "@bayfront/types/shared.js";
import { QuizController } from "~/presentation/controllers/quiz.controller.js";
import { AppRouter } from "@bayfront/http/Router.js";

export class QuizRouter extends AppRouter {

    override setup() {
        return {
            routes: [
                {
                    path: '/',
                    method: HttpMethod.GET,
                    action: this.handler(QuizController, 'getAll')
                },
                {
                    path: '/:id',
                    method: HttpMethod.GET,
                    action: this.handler(QuizController, 'getById')
                },
            ]
        } satisfies RouterEntry;
    }
}
