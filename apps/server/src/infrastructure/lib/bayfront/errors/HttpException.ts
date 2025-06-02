export class HttpException extends Error {
    readonly statusCode: number;
    readonly details: string;

    constructor(message: string, statusCode: number, details?: string) {
        super(message);
        this.statusCode = statusCode;
        this.details = details ?? message;
        this.name = this.constructor.name;
    }

    static BadRequest(details?: string) {
        return new HttpException("Bad Request", 400, details);
    }

    static NotFound(details?: string) {
        return new HttpException("Not Found", 404, details);
    }

    static InternalServerError(details?: string) {
        return new HttpException("Internal Server Error", 500, details);
    }

    static Unauthorized(details?: string) {
        return new HttpException("Unauthorized", 401, details);
    }

    static Forbidden(details?: string) {
        return new HttpException("Forbidden", 403, details);
    }

    static MethodNotAllowed(details?: string) {
        return new HttpException("Method Not Allowed", 405, details);
    }

    static NotImplemented(details?: string) {
        return new HttpException("Not Implemented", 501, details);
    }
}