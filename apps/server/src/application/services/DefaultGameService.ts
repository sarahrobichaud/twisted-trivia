import { GameService } from "~/domain/contracts/services/GameService.js";
import { Quiz } from "~/domain/entities/Quiz.js";
import { Game, GameParameters } from "~/domain/entities/Game.js";
import { GameRepository } from "~/domain/contracts/repositories/GameRepository.js";
import { GameConfig } from "~/domain/contracts/configuration/GameConfigs.js";
import { Player } from "~/domain/entities/Player.js";
import { GameEventService } from "~/domain/contracts/services/GameEventService.js";
import { GameEventEmitter } from "~/domain/events/GameEventEmitter.js";
import { GameConnectionService } from "~/domain/contracts/services/GameConnectionService.js";
import { ConnectionAuthorization } from "~/domain/values/ConnectionAuthorization.js";

export class DefaultGameService implements GameService {

    #gameRepository: GameRepository;
    #gameConnectionService: GameConnectionService;
    #config: GameConfig;

    #gameEventService: GameEventService;

    constructor(gameRepository: GameRepository, gameConnectionService: GameConnectionService, gameEventService: GameEventService, config: GameConfig) {
        this.#gameRepository = gameRepository;
        this.#gameConnectionService = gameConnectionService;
        this.#gameEventService = gameEventService;
        this.#config = config;
    }

    async createGame(quiz: Quiz): Promise<ConnectionAuthorization> {

        const game = await DefaultGameService.createGame(quiz, this.#gameEventService, this.#config);

        this.#gameRepository.registerGame(game);

        const player = await DefaultGameService.createPlayer(this.#config);

        game.join(player);

        player.accessToken = await this.#gameConnectionService.generateAccessToken(game.id, player.id);

        return await this.#gameConnectionService.generateConnectionAuthorization(game, player);
    }

    async joinGame(game: Game): Promise<ConnectionAuthorization> {

        const player = await DefaultGameService.createPlayer(this.#config);

        game.join(player);

        player.accessToken = await this.#gameConnectionService.generateAccessToken(game.id, player.id);

        return await this.#gameConnectionService.generateConnectionAuthorization(game, player);
    }

    async getByJoinCode(joinCode: string): Promise<Game | null> {
        return this.#gameRepository.findByJoinCode(joinCode);
    }

    async getByID(gameId: string): Promise<Game | null> {
        return this.#gameRepository.findById(gameId);
    }

    async getPlayer(gameId: string, playerId: string): Promise<Player | null> {

        const game = await this.#gameRepository.findById(gameId);

        if (!game) {
            throw new Error("Game not found");
        }

        const player = game.getPlayer(playerId);

        if (!player) {
            throw new Error("Player not found");
        }

        return player;
    }


    private static async createPlayer(config: GameConfig): Promise<Player> {
        const playerID = DefaultGameService.generatePlayerID();
        const player = new Player(playerID, config);

        return player;
    }

    private static async createGame(quiz: Quiz, emitter: GameEventEmitter, config: GameConfig): Promise<Game> {
        const joinCode = DefaultGameService.generateJoinCode();
        const gameID = DefaultGameService.generateGameID();

        const params: GameParameters = {
            id: gameID,
            joinCode,
            quiz,
            config
        };

        const game = Game.create(params);

        game.eventEmitter = emitter;

        return game;
    }

    private static generateJoinCode(): string {
        return Math.random().toString(36).substring(2, 7);
    }

    private static generatePlayerID(): string {
        return crypto.randomUUID();
    }

    private static generateGameID(): string {
        return crypto.randomUUID();
    }
}


