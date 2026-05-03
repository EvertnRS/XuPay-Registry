import { MessageBody } from "@/@types/contracts/MessageBody";
import { Socket } from "net";
import { IRegistryRepository } from "../domain/repository/IRegistryRepository";
import { ResponseParser } from "@/infra/parser/ResponseParser";
import { ErrorHandler } from "@/infra/middleware/Error";

export class RegistryService {

    constructor(
        private registryRepository: IRegistryRepository
    ) {}

    public async getRegistries(messageBody: MessageBody, socket: Socket): Promise<void> {
        if (!messageBody.payload || typeof messageBody.payload === "string") {
            return ErrorHandler.handle("Payload ausente ou em formato inválido", socket);
        }

        const registries = await this.registryRepository.findByService({
            service: messageBody.payload.service
        });
        if (registries.length === 0) {
            return ErrorHandler.handle("Nenhum registro encontrado para o serviço especificado", socket);
        }

        const payload = registries.map(registry => {
            return `id=${registry.id},service=${registry.service},instanceName=${registry.instanceName},status=${registry.status}`;
        });

        const response = ResponseParser.serialize({
            method: "GET",
            path: "instance",
            body: {
                source: "REGISTRY_SERVICE",
                type: "RESPONSE",
                payload: payload.join('&'),
                timestamp: new Date().toISOString()
            }
        });

        socket.write(response);
        socket.end();
    }

    public async createRegistry(messageBody: MessageBody,  socket: Socket): Promise<void> {
        if (!messageBody.payload || typeof messageBody.payload === "string") {
            return ErrorHandler.handle("Payload ausente ou em formato inválido", socket);
        }

        if (!messageBody.payload.instanceName) {
            return ErrorHandler.handle("Nome de instância para essa rota é obrigatório", socket);
        }
        
        await this.registryRepository.createRegistry({
            service: messageBody.payload.service,
            instanceName: messageBody.payload.instanceName
        });

        socket.write("Registro criado com sucesso");
        socket.end();
    }

    public async updateRegistry(messageBody: MessageBody, socket: Socket): Promise<void> {
        if (!messageBody.payload || typeof messageBody.payload === "string") {
            return ErrorHandler.handle("Payload ausente ou em formato inválido", socket);
        }

        if (!messageBody.payload.id) {
            return ErrorHandler.handle("Id de registro para essa rota é obrigatório", socket);
        }
        
        if (!messageBody.payload.instanceName) {
            return ErrorHandler.handle("Nome de instância para essa rota é obrigatório", socket);
        }

        if (!messageBody.payload.status) {
            return ErrorHandler.handle("Status de instância para essa rota é obrigatório", socket);
        }
        
        await this.registryRepository.updateRegistry({
            id: messageBody.payload.id,
            status: messageBody.payload.status
        });

        socket.write("Registro atualizado com sucesso");
        socket.end();
    }

    public async deleteRegistry(messageBody: MessageBody, socket: Socket): Promise<void> {
        if (!messageBody.payload || typeof messageBody.payload === "string") {
            return ErrorHandler.handle("Payload ausente ou em formato inválido", socket);
        }

        if (!messageBody.payload.id) {
            return ErrorHandler.handle("Id de registro para essa rota é obrigatório", socket);
        }

        await this.registryRepository.deleteRegistry({
            id: messageBody.payload.id
        });

        socket.write("Registro deletado com sucesso");
        socket.end();
    }
}