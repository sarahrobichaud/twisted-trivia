
export type ScoreConfig = {
    pointPerQuestion: number;
    maxMultiplier: number;
    minMultiplier: number;
}

export type PlayerConfig = {
    max: number;
    disconnectGracePeriodMS: number;
}

export type GameConfig = {
    score: ScoreConfig;
    players: PlayerConfig;
}




