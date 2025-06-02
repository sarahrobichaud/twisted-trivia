import { GameRepository } from "~/domain/contracts/repositories/GameRepository.js";
import { AccessTokenService } from "~/domain/contracts/services/AccessTokenServiceContract.js";
import { GameConnectionService } from "~/domain/contracts/services/GameConnectionService.js";
import { Game } from "~/domain/entities/Game.js";
import { Player } from "~/domain/entities/Player.js";
import { ConnectionAuthorization } from "~/domain/values/ConnectionAuthorization.js";

export class DefaultGameConnectionService implements GameConnectionService {

    #gameRepository: GameRepository;
    #accessTokenService: AccessTokenService;

    constructor(gameRepository: GameRepository, accessTokenService: AccessTokenService) {
        this.#gameRepository = gameRepository;
        this.#accessTokenService = accessTokenService;
    }

    async isGameJoinable(gameId: string, playerId: string): Promise<boolean> {
        const game = await this.#gameRepository.findById(gameId);

        if (!game) {
            return false;
        }

        const isJoinable = !game.hasStarted && !game.isFull;

        const player = await this.#getPlayer(gameId, playerId);

        if (player && !isJoinable) {
            game.removePlayer(player);
        }

        return isJoinable;
    }

    async generateConnectionAuthorization(game: Game, player: Player): Promise<ConnectionAuthorization> {
        return {
            game: game,
            player: player,
            accessToken: await this.generateAccessToken(game.id, player.id)
        }
    }

    async authenticate(gameId: string, token: string, username?: string): Promise<Player | null> {

        const validation = await this.#accessTokenService.verifyToken(gameId, token);

        if (!validation.isValid || !validation.playerId) {
            return null;
        }

        const player = await this.#getPlayer(gameId, validation.playerId);

        if (!player) {
            return null;
        }

        if (username) {
            player.username = username;
        }

        return player;
    }

    async connect(connectionId: string, gameId: string, playerId: string): Promise<void> {
        const player = await this.#getPlayer(gameId, playerId);

        if (!player) {
            throw new Error("Player not found");
        }

        const game = await this.#gameRepository.findById(gameId);

        if (!game) {
            throw new Error("Game not found");
        }

        game.connectPlayer(connectionId, player);
    }

    async disconnect(gameId: string, playerId: string): Promise<void> {
        const player = await this.#getPlayer(gameId, playerId);

        if (!player) {
            throw new Error("Player not found");
        }

        const game = await this.#gameRepository.findById(gameId);

        if (!game) {
            throw new Error("Game not found");
        }

        game.disconnectPlayer(player);
    }

    async generateAccessToken(gameId: string, playerId: string): Promise<string> {

        const player = await this.#getPlayer(gameId, playerId);

        if (!player) {
            throw new Error("Player not found");
        }

        return this.#accessTokenService.generateToken(gameId, playerId);
    }


    async #getPlayer(gameId: string, playerId: string): Promise<Player | null> {

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

}