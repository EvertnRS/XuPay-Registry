import { Socket } from "net";
import { IRegistryRepository } from "../domain/repository/IRegistryRepository";
import { InstanceStatus } from "@/infra/database/generated/enums";
import { ResponseParser } from "@/infra/parser/ResponseParser";
import { ErrorHandler } from "@/infra/middleware/Error";

export class RegistryService {

    constructor(
        private registryRepository: IRegistryRepository
    ) {}

    public async getRegistries(service: string, socket: Socket): Promise<void> {
        const registries = await this.registryRepository.findByService({
            service: service
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

    public async createRegistry(instanceName: string, service: string, socket: Socket): Promise<void> {
        if (!instanceName) {
            return ErrorHandler.handle("Nome de instância para essa rota é obrigatório", socket);
        }
        
        await this.registryRepository.createRegistry({
            service: service,
            instanceName: instanceName
        });

        socket.write("Registro criado com sucesso");
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
        
        await this.registryRepository.updateRegistry({
            id: id,
            status: parsedStatus
        });

        socket.write("Registro atualizado com sucesso");
        socket.end();
    }

    public async deleteRegistry(id: string, socket: Socket): Promise<void> {
        if (!id) {
            return ErrorHandler.handle("Id de registro para essa rota é obrigatório", socket);
        }

        await this.registryRepository.deleteRegistry({
            id
        });

        socket.write("Registro deletado com sucesso");
        socket.end();
    }
}