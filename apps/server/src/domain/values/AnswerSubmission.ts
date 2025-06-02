export class AnswerSubmission {
    #playerId: string;
    #answerId: string;
    #gameId: string;

    constructor(playerId: string, answerId: string, gameId: string) {
        this.#playerId = playerId;
        this.#answerId = answerId;
        this.#gameId = gameId;
    }

    get playerId(): string {
        return this.#playerId;
    }

    get answerId(): string {
        return this.#answerId;
    }

    get gameId(): string {
        return this.#gameId;
    }
}
