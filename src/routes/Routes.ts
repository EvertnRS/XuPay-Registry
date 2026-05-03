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
        if (request.path === "instance" && request.method === "GET" && request.body.type === 'REQUEST') {
            this.registryController.getRegistries(request, socket);
        } else if (request.path === "instance-create" && request.method === "POST" && request.body.type === 'REQUEST') {
            this.registryController.createRegistry(request, socket);
        } else if (request.path === "instance-update" && request.method === "PUT" && request.body.type === 'REQUEST') {
            this.registryController.updateRegistry(request, socket);
        } else if (request.path === "instance-delete" && request.method === "DELETE" && request.body.type === 'REQUEST') {
            this.registryController.deleteRegistry(request, socket);
        } else {
            return ErrorHandler.handle("Rota não encontrada", socket);
        }
    }
}