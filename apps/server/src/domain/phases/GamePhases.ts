export const GamePhase = {
    WAITING: "waiting",
    PLAYING: "questioning",
    COOLDOWN: "cooldown",
    ENDED: "end",
} as const;

export type GamePhase = typeof GamePhase[keyof typeof GamePhase];
