import { Socket } from "net";
import { isValidRequest } from "@/@types/contracts/Request";
import {RegistryService} from "../service/RegistryService";
import { Request } from "@/@types/contracts/Request";
import { ErrorHandler } from "@/infra/middleware/Error";
import { GetRegistryPayload } from "@/@types/contracts/payload/GetRegistryPayload";
import { DeleteRegistryPayload } from "@/@types/contracts/payload/DeleteRegistryPayload";
import { UpdateRegistryPayload } from "@/@types/contracts/payload/UpdateRegistryPayload";
import { RegisterInstancePayload } from "@/@types/contracts/payload/RegisterInstancePayload";

export class RegistryController {
    constructor(private registryService: RegistryService) {}

    public getRegistries(request: Request, socket: Socket): void {
        const validRequest = isValidRequest(request, socket);
        
        if (!validRequest) {
            return     
        }

        const payload = validRequest.body.payload;

        const { event } = payload as GetRegistryPayload;

        this.registryService.getRegistries(event, socket);
    }

    /*public createRegistry(request: Request, socket: Socket): void {
        const validRequest = isValidRequest(request, socket);
        
        if (!validRequest) {
            return ErrorHandler.handle("Corpo da requisição inválido", socket);      
        }

        const payload = validRequest.body.payload;

        const { instanceName, event, path } = payload as CreateRegistryPayload;
        
        this.registryService.createRegistry(instanceName, event, path, socket);
    }*/


    public registerInstance(request: Request, socket: Socket): void {
        const validRequest = isValidRequest(request, socket);
        
        if (!validRequest) {
            return ErrorHandler.handle("Corpo da requisição inválido", socket);      
        }
        
        const payload = validRequest.body.payload;

        const { instanceName, event, path, port } = payload as RegisterInstancePayload;

        this.registryService.registerInstance(instanceName, event, path, port, socket);
    }

    public deleteRegistry(request: Request, socket: Socket): void {
        const validRequest = isValidRequest(request, socket);
        
        if (!validRequest) {
            return ErrorHandler.handle("Corpo da requisição inválido", socket);      
        }

        const payload = validRequest.body.payload;

        const { id } = payload as DeleteRegistryPayload;
        
        this.registryService.deleteRegistry(id, socket);
    }

    public updateRegistry(request: Request, socket: Socket): void {
        const validRequest = isValidRequest(request, socket);
        
        if (!validRequest) {
            return ErrorHandler.handle("Corpo da requisição inválido", socket);      
        }
        
        const payload = validRequest.body.payload;

        const { id, ip, port, status, path } = payload as UpdateRegistryPayload;

        this.registryService.updateRegistry(id, ip, port, path, status, socket);
    }
}