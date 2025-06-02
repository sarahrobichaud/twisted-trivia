import crypto from 'crypto';
import { AccessTokenService } from "~/domain/contracts/services/AccessTokenServiceContract.js";

// This would use something more secure if not a school project
export class DefaultAccessTokenService implements AccessTokenService {

    static #EXPIRATION_TIME = 1000 * 60 * 4; // 4 minutes
    static #RANDOM_BYTES_LENGTH = 16;


    async generateToken(gameId: string, playerId: string): Promise<string> {
        const randomToken = crypto.randomBytes(DefaultAccessTokenService.#RANDOM_BYTES_LENGTH).toString('hex');
        const timestamp = Date.now();

        const payload = `${gameId}:${playerId}:${timestamp}:${randomToken}`;

        return Buffer.from(payload).toString('base64');
    }

    async verifyToken(gameId: string, token: string): Promise<{ isValid: boolean; playerId: string | null; }> {
        try {

            const decoded = Buffer.from(token, 'base64').toString('utf8');

            const [tokenGameId, playerId, timestamp, randomToken] = decoded.split(':');

            if (tokenGameId !== gameId) {
                return { isValid: false, playerId: null };
            }

            const currentTimestamp = Date.now();
            const expirationTime = currentTimestamp + DefaultAccessTokenService.#EXPIRATION_TIME;

            if (currentTimestamp - parseInt(timestamp) > expirationTime) {
                return { isValid: false, playerId: null };
            }

            if (randomToken.length !== DefaultAccessTokenService.#RANDOM_BYTES_LENGTH * 2) {
                return { isValid: false, playerId: null };
            }

            return { isValid: true, playerId: playerId };

        } catch (error) {
            return { isValid: false, playerId: null };
        }
    }
}