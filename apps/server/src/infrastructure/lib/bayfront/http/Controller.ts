import { ControllerContext } from "@bayfront/types/shared.js";

export class AppController<TServices = BayFront.Services> {

    #context: ControllerContext;

    constructor(context: ControllerContext) {
        this.#context = context;
    }

    protected get services(): TServices {
        return this.#context.services as TServices;
    }
}