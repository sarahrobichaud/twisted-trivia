import { Container } from "@infra/di/container.js";
import { AppModule } from "@bayfront/app/AppModule.js";
import cors from "cors";

import { HealthRouter } from "./http/routers/health.router.js";
import { QuizRouter } from "./http/routers/quiz.router.js";
import { bayfrontConfig as appConfig } from "./config/BayFront.js";
import { AppHttpServer } from "./http/HttpServer.js";
import { GameRouter } from "./http/routers/game.router.js";
import { TriviaAppRouter } from "./http/routers/app.router.js";

export class Application {

    #trivia: AppModule;
    #container: Container;

    #http: AppHttpServer;

    constructor(container: Container) {
        this.#container = container;
        this.#trivia = this.#setupTrivia();

        this.#http = new AppHttpServer(this.#trivia.app);

        this.#configureWebSockets(container);
    }

    start() {
        this.#trivia.init();
        this.#http.listen()
    }

    #configureWebSockets(container: Container) {

        const server = container.socket.io.initialize(this.#http.server)

        const { game } = container.socket.io.namespaceManager.configureNamespaces(server);

        container.socket.gameEventPublisher.setupNamespace(game);
    }

    #setupTrivia() {
        const triviaModule = new AppModule(this.#container, appConfig);

        triviaModule.use(cors());
        triviaModule.useResponseFormatter(appConfig.responseFormatter)

        triviaModule.registerRouter({ prefix: "/app", apiRoute: false }, TriviaAppRouter);
        triviaModule.registerRouter({ prefix: "/quiz", apiRoute: true }, QuizRouter);
        triviaModule.registerRouter({ prefix: "/game", apiRoute: true }, GameRouter);
        triviaModule.registerRouter({ prefix: "/", apiRoute: false }, HealthRouter);

        triviaModule.useDefaultErrorHandler();

        return triviaModule;
    }
}

