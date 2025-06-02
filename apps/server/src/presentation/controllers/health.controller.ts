import { AppController } from "@bayfront/http/Controller.js";
import { Response, Request, NextFunction } from "express";

export class HealthController extends AppController {

    healthCheck(req: Request, res: Response, next: NextFunction) {

        const data = {
            status: "ok",
        }

        res.success(data, "Health check successful");
    }
}
