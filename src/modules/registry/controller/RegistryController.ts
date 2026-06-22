import { Socket } from "net";
import { isValidRequest } from "@/@types/contracts/Request";
import {RegistryService} from "../service/RegistryService";
import { Request } from "@/@types/contracts/Request";
import { ErrorHandler } from "@/infra/middleware/Error";
import { GetRegistryPayload } from "@/@types/contracts/payload/GetRegistryPayload";
import { CreateRegistryPayload } from "@/@types/contracts/payload/CreateRegistryPayload";
import { DeleteRegistryPayload } from "@/@types/contracts/payload/DeleteRegistryPayload";
import { UpdateRegistryPayload } from "@/@types/contracts/payload/UpdateRegistryPayload";

export class RegistryController {
    constructor(private registryService: RegistryService) {}

    public getRegistries(request: Request, socket: Socket): void {
        const validRequest = isValidRequest(request, socket);
        
        if (!validRequest) {
            console.log("Invalid request body:", request.body);
            return ErrorHandler.handle("Corpo da requisição inválido", socket);      
        }

        console.log("Valid request body:", validRequest.body);

        const payload = validRequest.body.payload;

        const { event } = payload as GetRegistryPayload;

        this.registryService.getRegistries(event, socket);
    }

    public createRegistry(request: Request, socket: Socket): void {
        const validRequest = isValidRequest(request, socket);
        
        if (!validRequest) {
            return ErrorHandler.handle("Corpo da requisição inválido", socket);      
        }

        const payload = validRequest.body.payload;

        const { instanceName, event, path } = payload as CreateRegistryPayload;
        
        this.registryService.createRegistry(instanceName, event, path, socket);
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

        const { id, status } = payload as UpdateRegistryPayload;

        this.registryService.updateRegistry(id, status, socket);
    }
}