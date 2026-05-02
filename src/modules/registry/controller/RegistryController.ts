import { Socket } from "net";
import { isValidBodyRequest } from "@/@types/contracts/Request";
import {RegistryService} from "../service/RegistryService";
import { Request } from "@/@types/contracts/Request";
import { ErrorHandler } from "@/infra/middleware/Error";

export class RegistryController {
    constructor(private registryService: RegistryService) {}
    public getRegistries(request: Request, socket: Socket): void {
        const messageBody = isValidBodyRequest(request.body, socket);
        
        if (!messageBody) {
            return ErrorHandler.handle("Corpo da requisição é inválido", socket);
        }

        this.registryService.getRegistries(messageBody, socket);
    }

    public createRegistry(request: Request, socket: Socket): void {
        const messageBody = isValidBodyRequest(request.body, socket);
        
        if (!messageBody) {
            return ErrorHandler.handle("Corpo da requisição é inválido", socket);
        }
        
        this.registryService.createRegistry(messageBody, socket);
    }

        public deleteRegistry(request: Request, socket: Socket): void {
        const messageBody = isValidBodyRequest(request.body, socket);
        
        if (!messageBody) {
            return ErrorHandler.handle("Corpo da requisição é inválido", socket);
        }
        
        this.registryService.deleteRegistry(messageBody, socket);
    }

    public updateRegistry(request: Request, socket: Socket): void {
        const messageBody = isValidBodyRequest(request.body, socket);
        
        if (!messageBody) {
            return ErrorHandler.handle("Corpo da requisição é inválido", socket);
        }
        
        this.registryService.updateRegistry(messageBody, socket);
    }
}