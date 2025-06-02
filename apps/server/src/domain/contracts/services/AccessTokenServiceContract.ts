export interface AccessTokenService {
    generateToken(gameId: string, playerId: string): Promise<string>;
    verifyToken(gameId: string, token: string): Promise<{ isValid: boolean, playerId: string | null }>;
}
