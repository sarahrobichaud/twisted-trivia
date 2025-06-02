import { Routine } from "../contracts/Routine.js";

export class Timer implements Routine {
    #startTime: number | null = null;
    #timeLimit: number = 0;

    #tickHandler: (() => void) | null = null;
    #timerEndHandler: (() => void) | null = null;

    #timeout: NodeJS.Timeout | null = null;
    #tickInterval: NodeJS.Timeout | null = null;
    tickRateMS: number = 1000;

    set onTickHandler(handler: () => void) {
        this.#tickHandler = handler;
    }

    set onTimerEndHandler(handler: () => void) {
        this.#timerEndHandler = handler;
    }

    startTimer(timeLimit: number): void {
        this.#startTime = Date.now();
        this.#timeLimit = timeLimit;

        // Emit the tick handler immediately
        this.#tickHandler?.();

        this.#tickInterval = setInterval(() => {
            this.#tickHandler?.();
            if (this.isTimeUp) {
                this.#timeout = setTimeout(() => {
                    this.#timerEndHandler?.();
                    this.reset();
                }, 1000);
            }
        }, this.tickRateMS);
    }

    stopTimer(): void {
        this.#startTime = null;
        if (this.#tickInterval) {
            clearInterval(this.#tickInterval);
            this.#tickInterval = null;
        }
    }

    reset(): void {
        this.#startTime = null;
        this.#timeLimit = 0;
        if (this.#tickInterval) {
            clearInterval(this.#tickInterval);
            this.#tickInterval = null;
        }
    }

    get elapsedTimeMs(): number {
        if (!this.#startTime) return 0;
        return Date.now() - this.#startTime;
    }

    get elapsedTimeSec(): number {
        return Math.floor(this.elapsedTimeMs / 1000);
    }

    get remainingTimeMs(): number {
        if (!this.#startTime) return 0;
        return Math.max(0, this.#timeLimit - this.elapsedTimeMs);
    }

    get remainingTimeSec(): number {
        return Math.ceil(this.remainingTimeMs / 1000);
    }

    get isTimeUp(): boolean {
        return this.#startTime !== null && this.remainingTimeMs === 0;
    }

    destroy(): void {
        this.stopTimer();
        if (this.#timeout) {
            clearTimeout(this.#timeout);
            this.#timeout = null;
        }
    }
}