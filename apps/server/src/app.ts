import { PrismaClient } from "@prisma/client";

import { GameConfig } from "@domain/contracts/configuration/GameConfigs.js";

import { Container, createContainer } from "@infra/di/container.js";
import { Application } from "@infra/Application.js";
import { seed } from "./infrastructure/persistence/data/seed.js";

export class App {
    #app: Application;

    constructor() {

        const db = new PrismaClient();

        const gameSettings = {
            score: {
                maxMultiplier: 6,
                minMultiplier: 1,
                pointPerQuestion: 100,
            },
            players: {
                max: 6,
                disconnectGracePeriodMS: 10000,
            },
        } satisfies GameConfig

        const container = createContainer(db, gameSettings);

        if (process.env.SEED_DB) {
            this.#seedDatabase(db);
        }

        this.#app = new Application(container);
    }

    start() {
        this.#app.start();
    }

    #seedDatabase(db: PrismaClient) {
        seed(db);
    }
}
