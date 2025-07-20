export interface QuizDetail {
    id: string;
    title: string;
    description: string;
    questionCount: number;
}

export interface GameRequest {
    joinCode: string;
    accessCode: string;
}

export interface ConnectionResponse {
    accessToken: string;
    gameID: string;
}

export interface APISuccess<T> {
    data: T;
    success: true;
    message: string;
    status: number;
    timestamp: string;
}

export interface APIError {
    error: string;
    success: false;
    message: string;
    status: number;
    timestamp: string;
}


export type APIResponse<T> = APISuccess<T> | APIError;

export const GAME_PHASE = {
    WAITING: "waiting",
    PLAYING: "questioning",
    COOLDOWN: "cooldown",
    ENDED: "end",
} as const;

export type GamePhase = typeof GAME_PHASE[keyof typeof GAME_PHASE];

