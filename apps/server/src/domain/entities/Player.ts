import { GameRole } from "@domain/roles/GameRoles.js";
import { GameConfig } from "../contracts/configuration/GameConfigs.js";

export class Player {

    static #defaultUsernameSuffix = 0;

    #id: string;
    #username: string;
    #roles: GameRole[];

    #accessToken: string | null = null;

    #connectionId: string | null = null;

    #isConnected: boolean;
    #disconnectedAt: number | null = null;

    #hasAnswered: boolean;
    #disconnectionGracePeriodMS: number;

    #score: number;

    constructor(id: string, config: GameConfig) {
        Player.#defaultUsernameSuffix++;
        this.#id = id;
        this.#username = `Player ${Player.#defaultUsernameSuffix}`;
        this.#roles = [GameRole.PLAYER];
        this.#isConnected = false;
        this.#hasAnswered = false;

        this.#score = 0;

        this.#disconnectionGracePeriodMS = config.players.disconnectGracePeriodMS;
    }

    get accessToken(): string {
        if (!this.#accessToken) {
            throw new Error("Access token not set");
        }
        return this.#accessToken;
    }

    set accessToken(accessToken: string) {
        this.#accessToken = accessToken;
    }

    get hasAnswered(): boolean {
        return this.#hasAnswered;
    }

    set hasAnswered(hasAnswered: boolean) {
        this.#hasAnswered = hasAnswered;
    }

    get isHost(): boolean {
        return this.#roles.includes(GameRole.HOST);
    }

    get playable(): boolean {
        return !this.#roles.includes(GameRole.HOST);
    }

    get id(): string {
        return this.#id;
    }

    get connectionId(): string | null {
        return this.#connectionId;
    }

    get isConnected(): boolean {
        return this.#isConnected && this.#connectionId !== null;
    }

    get username(): string {
        return this.#username;
    }

    set username(username: string) {
        this.#username = username;
    }

    get roles(): GameRole[] {
        return this.#roles;
    }

    get score(): number {
        return this.#score;
    }

    get isOrphan(): boolean {
        if (this.isConnected || !this.#disconnectedAt) {
            return false;
        }

        const timeSinceDisconnected = Date.now() - this.#disconnectedAt;

        return timeSinceDisconnected > this.#disconnectionGracePeriodMS;
    }

    connect(connectionId: string): void {
        this.#isConnected = true;
        this.#connectionId = connectionId;
    }

    disconnect(): void {
        this.#isConnected = false;
        this.#connectionId = null;
        this.#disconnectedAt = Date.now();
    }

    addRole(role: GameRole): void {
        this.#roles.push(role);
    }

    removeRole(role: GameRole): void {
        this.#roles = this.#roles.filter(r => r !== role);
    }

    addScore(score: number): void {
        this.#score += score;
    }

    resetScore(): void {
        this.#score = 0;
    }

    toListDTO(position: number) {
        return {
            socketID: this.#connectionId,
            username: this.#username,
            score: this.#score,
            status: this.#isConnected ? "connected" : "disconnected",
            position
        };
    }

}
