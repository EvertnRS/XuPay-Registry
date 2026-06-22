import { Socket } from "net";
import type { Request } from "../@types/contracts/Request";
import { ErrorHandler } from "../infra/middleware/Error";
import { RegistryRepositoryImpl } from "../modules/registry/domain/repository/RegistryRepositoryImpl";
import { RegistryService } from "../modules/registry/service/RegistryService";
import { RegistryController } from "../modules/registry/controller/RegistryController";

export class Routes {
    private registryRepositoryImpl: RegistryRepositoryImpl;
    private registryService: RegistryService;
    private registryController: RegistryController;

    constructor() {
        this.registryRepositoryImpl = new RegistryRepositoryImpl();
        this.registryService = new RegistryService(this.registryRepositoryImpl);
        this.registryController = new RegistryController(this.registryService);
    }

    public handle(request: Request, socket: Socket): void {
        if (request.path === "discover" && request.method === "GET") {
            this.registryController.getRegistries(request, socket);

        } else if (request.path === "create" && request.method === "POST") {
            this.registryController.createRegistry(request, socket);

        } else if (request.path === "update" && request.method === "PUT") {
            this.registryController.updateRegistry(request, socket);

        } else if (request.path === "delete" && request.method === "DELETE") {
            this.registryController.deleteRegistry(request, socket);

        } else {
            return ErrorHandler.handle("Rota não encontrada", socket);
        }
    }
}