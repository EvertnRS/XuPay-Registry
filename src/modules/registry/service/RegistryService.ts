import { Socket } from "net";
import { IRegistryRepository } from "../domain/repository/IRegistryRepository";
import { InstanceStatus } from "@/infra/database/generated/enums";
import { ResponseParser } from "@/infra/parser/ResponseParser";
import { ErrorHandler } from "@/infra/middleware/Error";
import { RegistryInstance } from "../domain/entity/Registry";
import { DNSServiceClient } from "./client/DNSServiceClient";
import { UdpSocketClient } from "@/infra/client/UdpSocketClient";

function parseRequiredPort(value: string | undefined, name: string): number {
  const parsedPort = Number.parseInt(value ?? "", 10);

  if (!Number.isInteger(parsedPort) || parsedPort < 0 || parsedPort > 65535) {
    throw new Error(`Invalid or missing port for ${name}`);
  }

  return parsedPort;
}

export class RegistryService {
    private dnsServiceClient: DNSServiceClient;
    constructor(
        private registryRepository: IRegistryRepository
    ) {
        const udpSocketClient = new UdpSocketClient();
        this.dnsServiceClient = new DNSServiceClient(
            udpSocketClient,
            process.env.DNS_SERVICE_HOST || "localhost",
            parseRequiredPort(process.env.DNS_SERVICE_PORT, "DNS_SERVICE_PORT")
        );
    }

    public async getRegistries(event: string, socket: Socket): Promise<void> {
        const registries = await this.registryRepository.findByEvent(event);

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
                        ip: registry.ip,
                        port: registry.port,
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

    // FIX: troquei o create por registerInstance
    public async registerInstance(instanceName: string, event: string, path: string, port: number, socket: Socket): Promise<void> {
        if (!instanceName || !event || !path || !port) {
            return ErrorHandler.handle("Todos os campos são obrigatórios", socket);
        }
        const ip = socket.remoteAddress;

        if (!ip) {
            return ErrorHandler.handle("Não foi possível obter o endereço IP do cliente", socket);
        }

        const registryOnPort = await this.registryRepository.findByPort(port);

        if (registryOnPort && registryOnPort.instanceName !== instanceName) {
            return ErrorHandler.handle(
                `A porta ${port} já está em uso.`,
                socket
            );
        }

        const existingRegistry = await this.registryRepository.findByInstanceName(instanceName);
        
        let registryInstance: RegistryInstance;

        if(existingRegistry) {
            registryInstance = await this.updateRegistration(
                existingRegistry.id, 
                ip,
                port,
                path,
                InstanceStatus.ACTIVE,
                new Date()
            );
        } else {
            registryInstance = await this.registryRepository.registerInstance({
                instanceName,
                event,
                ip,
                port,
                path,
                status: InstanceStatus.ACTIVE,
                lastHeartbeat: new Date()
            });

            this.dnsServiceClient.create(instanceName, ip).catch((error) => {
                console.error(`Erro ao criar registro DNS para a instância ${instanceName}:`, error);
            });
        }


        const response = ResponseParser.serializeResponse(200, {
            id: registryInstance.id,
            event: registryInstance.event,
            instanceName: registryInstance.instanceName,
            status: registryInstance.status,
            ip: registryInstance.ip,
            port: registryInstance.port,
            path: registryInstance.path,
            createdAt: registryInstance.createdAt.toISOString()
        });

        socket.write(response);
        socket.end();
    }   

    public async updateRegistry(id: string, ip: string, port: number, path: string, status: InstanceStatus, socket: Socket): Promise<void> {
        if (!id) {
            return ErrorHandler.handle("Id de registro para essa rota é obrigatório", socket);
        }

        if (!status) {
            return ErrorHandler.handle("Status de instância para essa rota é obrigatório", socket);
        }

        if (!ip || !port) {
            return ErrorHandler.handle("IP e porta de instância para essa rota são obrigatórios", socket);
        }

        const parsedStatus = status as InstanceStatus;

        if (!Object.values(InstanceStatus).includes(parsedStatus)) {
            return ErrorHandler.handle(
            `Status inválido: ${status}. Valores aceitos: ${Object.values(InstanceStatus).join(", ")}`,
            socket
            );
        }

        const existingRegistry = await this.registryRepository.findByPort(port);

        if (existingRegistry && existingRegistry.id !== id) {
            return ErrorHandler.handle(
                `Porta ${port} já está em uso por outra instância. Por favor, escolha uma porta diferente.`,
                socket
            );
        }
        
        const updatedRegistry = await this.updateRegistration(
            id,
            ip,
            port,
            path,
            parsedStatus,
            new Date()
        );

        const response = ResponseParser.serializeResponse(200, {
            id: updatedRegistry.id,
            event: updatedRegistry.event,
            instanceName: updatedRegistry.instanceName,
            status: updatedRegistry.status,
            ip: updatedRegistry.ip,
            port: updatedRegistry.port,
            createdAt: updatedRegistry.createdAt.toISOString()
        });

        socket.write(response);
        socket.end();
    }

    public async deleteRegistry(id: string, socket: Socket): Promise<void> {
        if (!id) {
            return ErrorHandler.handle("Id de registro para essa rota é obrigatório", socket);
        }

        await this.registryRepository.deleteRegistry(id);

        const response = ResponseParser.serializeResponse(204, {});
        socket.write(response);
        socket.end();
    }

    private async updateRegistration(id: string, ip: string, port: number, path: string, status: InstanceStatus, lastHeartbeat: Date): Promise<RegistryInstance> {
        return await this.registryRepository.updateRegistry({
            id: id,
            ip: ip,
            port: port,
            path: path,
            status: status,
            lastHeartbeat: lastHeartbeat
        });
    }
}