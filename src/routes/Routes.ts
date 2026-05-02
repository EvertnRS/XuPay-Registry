import { Socket } from "net";
import type { Request }  from "../@types/contracts/Request";
import { ErrorHandler } from "../infra/middleware/Error";
import { RegistryRepositoryImpl } from "../modules/registry/domain/repository/RegistryRepositoryImpl";
import { RegistryService } from "../modules/registry/service/RegistryService";
import { RegistryController } from "../modules/registry/controller/RegistryController";

export class Routes {
    constructor(
        private registryRepositoryImpl = new RegistryRepositoryImpl(),
        private registerService = new RegistryService(this.registryRepositoryImpl),
        private registerController = new RegistryController(this.registerService)
    ) {}

	public handle(request:Request, socket:Socket):void  {
        if(request.path === '/service' && request.method === 'GET') {
            this.registerController.getRegistries(request, socket);
        }else{
            return ErrorHandler.handle("Rota não encontrada", socket);
        }
    }
}