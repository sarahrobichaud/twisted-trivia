export const GameRole = {
    HOST: "host",
    PLAYER: "player",
} as const;

export type GameRole = (typeof GameRole)[keyof typeof GameRole];

