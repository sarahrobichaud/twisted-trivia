import { PrismaClient } from "@prisma/client";

// Repositories
import { QuizRepository } from "@domain/contracts/repositories/QuizRepository.js";
import { GameRepository } from "@domain/contracts/repositories/GameRepository.js";

// Services
import { QuizService } from "@domain/contracts/services/QuizServiceContract.js";
import { GameService } from "~/domain/contracts/services/GameService.js";

// State
import { ApplicationStateManager } from "@domain/contracts/ApplicationStateManager.js";

// Config
import { GameConfig } from "@domain/contracts/configuration/GameConfigs.js";

// Implementations
import { PrismaQuizRepository } from "@infra/persistence/prisma/PrismaQuizRepository.js";
import { InMemoryGameRepository } from "@infra/persistence/memory/InMemoryGameRepository.js";

import { DefaultQuizService } from "@app/services/DefaultQuizService.js";
import { DefaultGameService } from "@app/services/DefaultGameService.js";
import { StateManager } from "@app/state/StateManager.js";
import { SocketIOServer } from "@infra/websocket/socketIO/SocketIOServer.js";
import { SocketIOGameCommandHandler } from "@infra/websocket/socketIO/SocketIOGameCommandHandler.js";
import { SocketIOConnectionHandler } from "@infra/websocket/socketIO/SocketIOConnectionHandler.js";
import { SocketIONamespaceManager } from "@infra/websocket/socketIO/SocketIONameSpaceManager.js";
import { DefaultConnectionGateway } from "@app/gateways/inbound/DefaultConnectionGateway.js";
import { DefaultAccessTokenService } from "@app/services/DefaultAccessTokenService.js";
import { AccessTokenService } from "@domain/contracts/services/AccessTokenServiceContract.js";
import { SocketIOEventPublisher } from "../websocket/socketIO/SocketIOEventPublisher.js";
import { DefaultGameEventService } from "~/application/services/DefaultGameEventService.js";
import { GameEventPublisher } from "~/application/gateways/outbound/GameEventPublisher.js";
import { GameConnectionService } from "~/domain/contracts/services/GameConnectionService.js";
import { DefaultGameConnectionService } from "~/application/services/DefaultGameConnectionService.js";
import { DefaultGameCommandService } from "~/application/services/DefaultGameCommandService.js";
import { GameCommandService } from "~/domain/contracts/services/GameCommandService.js";
import { GameEventService } from "~/domain/contracts/services/GameEventService.js";

export type Container = {
    stateManager: ApplicationStateManager;
    repositories: {
        quiz: QuizRepository;
        game: GameRepository;
    };
    services: {
        quiz: QuizService;
        game: GameService;
        accessToken: AccessTokenService;
        gameConnection: GameConnectionService;
        gameCommand: GameCommandService;
        gameEvent: GameEventService;
    };
    socket: {
        io: SocketIOServer;
        gameEventHandler: SocketIOGameCommandHandler;
        connectionHandler: SocketIOConnectionHandler;
        gameEventPublisher: GameEventPublisher;
    }
    gameConfig: GameConfig;
    db: PrismaClient;
}

export type Services = Container['services'];

export type DataAccessProvider = PrismaClient;

export function createContainer(db: DataAccessProvider, config: GameConfig): Container {

    const stateManager = new StateManager();
    const repositories = getRepositories(db, stateManager);
    const { socket, services } = setup(repositories, config);

    return {
        repositories: repositories,
        services: services,
        gameConfig: config,
        socket: socket,
        db: db,
        stateManager: stateManager,
    }
}

function getRepositories(db: DataAccessProvider, stateManager: ApplicationStateManager): Container["repositories"] {
    return {
        quiz: new PrismaQuizRepository(db),
        game: new InMemoryGameRepository(stateManager),
    }
}

function setup(repositories: Container["repositories"], config: GameConfig): { socket: Container["socket"], services: Container["services"] } {

    const accessTokenService = new DefaultAccessTokenService();
    const gameConnectionService = new DefaultGameConnectionService(repositories.game, accessTokenService);

    const connectionGateway = new DefaultConnectionGateway(gameConnectionService);

    const gameCommandService = new DefaultGameCommandService(repositories.game);
    const gameEventHandler = new SocketIOGameCommandHandler(gameCommandService);

    const connectionHandler = new SocketIOConnectionHandler(connectionGateway, gameEventHandler);

    const nsManager = new SocketIONamespaceManager(connectionHandler);

    const io = new SocketIOServer(nsManager);

    const gameEventPublisher = new SocketIOEventPublisher();
    const gameEventService = new DefaultGameEventService(gameEventPublisher);

    const gameService = new DefaultGameService(repositories.game, gameConnectionService, gameEventService, config);

    return {
        socket: {
            io: io,
            gameEventHandler: gameEventHandler,
            connectionHandler: connectionHandler,
            gameEventPublisher: gameEventPublisher,
        },
        services: {
            game: gameService,
            accessToken: accessTokenService,
            gameConnection: gameConnectionService,
            gameCommand: gameCommandService,
            gameEvent: gameEventService,
            quiz: new DefaultQuizService(repositories.quiz),
        }
    }
}