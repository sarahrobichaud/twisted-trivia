import { AppRouter } from "@bayfront/http/Router.js";
import { HttpMethod, RouterEntry } from "@bayfront/types/shared.js";
import { HealthController } from "~/presentation/controllers/health.controller.js";


export class HealthRouter extends AppRouter {

    override setup() {
        return {
            routes: [
                {
                    path: '/',
                    method: HttpMethod.GET,
                    action: this.handler(HealthController, 'healthCheck')
                }
            ]
        } satisfies RouterEntry;
    }
}
