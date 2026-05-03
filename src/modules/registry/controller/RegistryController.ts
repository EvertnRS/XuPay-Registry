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

        if(messageBody.payload.kind !== 'GET_REGISTRY_PAYLOAD') {
            return ErrorHandler.handle("Campo 'service' é obrigatório para essa rota", socket);
        }

        this.registryService.getRegistries(messageBody.payload.service, socket);
    }

    public createRegistry(request: Request, socket: Socket): void {
        const messageBody = isValidBodyRequest(request.body, socket);
        
        if (!messageBody) {
            return ErrorHandler.handle("Corpo da requisição é inválido", socket);
        }

        if(messageBody.payload.kind !== 'CREATE_REGISTRY_PAYLOAD') {
            return ErrorHandler.handle("Campo 'service' é obrigatório para essa rota", socket);
        }
        
        this.registryService.createRegistry(messageBody.payload.instanceName, messageBody.payload.service, socket);
    }

        public deleteRegistry(request: Request, socket: Socket): void {
        const messageBody = isValidBodyRequest(request.body, socket);
        
        if (!messageBody) {
            return ErrorHandler.handle("Corpo da requisição é inválido", socket);
        }

        if(messageBody.payload.kind !== 'DELETE_REGISTRY_PAYLOAD') {
            return ErrorHandler.handle("Campo 'service' é obrigatório para essa rota", socket);
        }
        
        this.registryService.deleteRegistry(messageBody.payload.id, socket);
    }

    public updateRegistry(request: Request, socket: Socket): void {
        const messageBody = isValidBodyRequest(request.body, socket);
        
        if (!messageBody) {
            return ErrorHandler.handle("Corpo da requisição é inválido", socket);
        }
        
        if(messageBody.payload.kind !== 'UPDATE_REGISTRY_PAYLOAD') {
            return ErrorHandler.handle("Campo 'service' é obrigatório para essa rota", socket);
        }

        this.registryService.updateRegistry(messageBody.payload.id, messageBody.payload.status, socket);
    }
}