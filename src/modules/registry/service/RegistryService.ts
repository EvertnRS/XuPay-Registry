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
        const registries = await this.registryRepository.findByTarget(messageBody.payload.target);

        const payload = registries.map(registry => {
            return `${registry.target},${registry.status},${registry.instanceName}`;
        });

        const response = ResponseParser.serialize({
            id: "RegistryService",
            type: "response",
            payload: payload.join(';')
        });

        socket.write(response);
        socket.end();
    }

    public async createRegistry(messageBody: MessageBody,  socket: Socket): Promise<void> {
        if (!messageBody.payload.instanceName) {
            return ErrorHandler.handle("Nome de instância para essa rota é obrigatório", socket);
        }
        
        await this.registryRepository.createRegistry(messageBody.payload.target, messageBody.payload.instanceName);

        socket.write("Registro criado com sucesso");
        socket.end();
    }

    public async updateRegistry(messageBody: MessageBody, socket: Socket): Promise<void> {
        if (!messageBody.payload.id) {
            return ErrorHandler.handle("Id de registro para essa rota é obrigatório", socket);
        }
        
        if (!messageBody.payload.instanceName) {
            return ErrorHandler.handle("Nome de instância para essa rota é obrigatório", socket);
        }

        if (!messageBody.payload.status) {
            return ErrorHandler.handle("Status de instância para essa rota é obrigatório", socket);
        }
        
        await this.registryRepository.updateRegistry(messageBody.payload.id, messageBody.payload.target, messageBody.payload.instanceName, messageBody.payload.status);

        socket.write("Registro atualizado com sucesso");
        socket.end();
    }

    public async deleteRegistry(messageBody: MessageBody, socket: Socket): Promise<void> {
        if (!messageBody.payload.id) {
            return ErrorHandler.handle("Id de registro para essa rota é obrigatório", socket);
        }

        await this.registryRepository.deleteRegistry(messageBody.payload.id);

        socket.write("Registro deletado com sucesso");
        socket.end();
    }
}