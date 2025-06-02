
import type { Container, Services as AppServices } from "~/infrastructure/di/container.ts";

declare global {
    namespace BayFront {
        interface ContainerType extends Container { }
        interface Services extends AppServices { }
    }
}