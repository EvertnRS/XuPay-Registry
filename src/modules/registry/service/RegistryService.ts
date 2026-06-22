import { Socket } from "net";
import { IRegistryRepository } from "../domain/repository/IRegistryRepository";
import { InstanceStatus } from "@/infra/database/generated/enums";
import { ResponseParser } from "@/infra/parser/ResponseParser";
import { ErrorHandler } from "@/infra/middleware/Error";

export class RegistryService {
    constructor(
        private registryRepository: IRegistryRepository
    ) {}

    public async getRegistries(event: string, socket: Socket): Promise<void> {
        const registries = await this.registryRepository.findByEvent({
            event
        });

        if (registries.length === 0) {
            return ErrorHandler.handle("Nenhum registro encontrado para o evento especificado", socket);
        }

        const responseBody = {
            registries: 
                registries.map(registry => {
                    return {
                        id: registry.id,
                        event: registry.event,
                        instanceName: registry.instanceName,
                        status: registry.status,
                        path: registry.path,
                        createdAt: new Date(registry.createdAt).toISOString()
                    }
                }
            )
        };

        const response = ResponseParser.serializeResponse(200, responseBody);

        socket.write(response);
        socket.end();
    }

    public async createRegistry(instanceName: string, event: string, path: string, socket: Socket): Promise<void> {
        if (!instanceName || !event || !path) {
            return ErrorHandler.handle("Todos os campos são obrigatórios", socket);
        }
        
        const createdRegistry = await this.registryRepository.createRegistry({
            event,
            instanceName,
            path
        });

        const responseBody = {
            id: createdRegistry.id,
            event: createdRegistry.event,
            instanceName: createdRegistry.instanceName,
            status: createdRegistry.status,
            path: createdRegistry.path,
            createdAt: new Date(createdRegistry.createdAt).toISOString()
        };

        const response = ResponseParser.serializeResponse(201, responseBody);
        socket.write(response);
        socket.end();
    }

    public async updateRegistry(id: string, status: string, socket: Socket): Promise<void> {
        if (!id) {
            return ErrorHandler.handle("Id de registro para essa rota é obrigatório", socket);
        }

        if (!status) {
            return ErrorHandler.handle("Status de instância para essa rota é obrigatório", socket);
        }

        const parsedStatus = status as InstanceStatus;

        if (!Object.values(InstanceStatus).includes(parsedStatus)) {
            return ErrorHandler.handle(
            `Status inválido: ${status}. Valores aceitos: ${Object.values(InstanceStatus).join(", ")}`,
            socket
            );
        }
        
        const updatedRegistry = await this.registryRepository.updateRegistry({
            id: id,
            status: parsedStatus
        });

        const responseBody = {
            id: updatedRegistry.id,
            event: updatedRegistry.event,
            instanceName: updatedRegistry.instanceName,
            status: updatedRegistry.status,
            path: updatedRegistry.path,
            createdAt: new Date(updatedRegistry.createdAt).toISOString()
        };

        const response = ResponseParser.serializeResponse(200, responseBody);

        socket.write(response);
        socket.end();
    }

    public async deleteRegistry(id: string, socket: Socket): Promise<void> {
        if (!id) {
            return ErrorHandler.handle("Id de registro para essa rota é obrigatório", socket);
        }

        await this.registryRepository.deleteRegistry({
            id
        });

        const response = ResponseParser.serializeResponse(204, {});
        socket.write(response);
        socket.end();
    }
}