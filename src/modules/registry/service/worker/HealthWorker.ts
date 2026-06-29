import { DNSServiceClient } from "@/modules/registry/service/client/DNSServiceClient";
import { TargetServiceClient } from "@/modules/registry/service/client/TargetServiceClient";
import { IRegistryRepository } from "../../domain/repository/IRegistryRepository";
import { UdpSocketClient } from "@/infra/client/UdpSocketClient";

export class HealthWorker {
    private readonly dnsServiceClient: DNSServiceClient;
    private readonly targetServiceClient: TargetServiceClient;

    constructor(
        private registryRepository: IRegistryRepository
    ) {
        const socketClient = new UdpSocketClient();

        this.dnsServiceClient = new DNSServiceClient(
            socketClient, 
            process.env.SERVICE_HOST || ' ', 
            parseInt(process.env.SERVICE_PORT || ' ')
        );

        this.targetServiceClient = new TargetServiceClient(
            socketClient,
          );
    }

    public start() {
        this.processQueue(); 
    }

    private async processQueue() {
        const registries = await this.registryRepository.findActives();

        for (const registry of registries) {
            try {
                const dnsResolution = await this.resolveDNS(registry.instanceName);
                const serviceResponse = await this.checkServiceHealth(dnsResolution.host, dnsResolution.port);

                if (serviceResponse !== "OK") {
                    await this.registryRepository.updateRegistry({
                        id: registry.id,
                        status: "INACTIVE"
                    });
                }

            } catch (error) {
                console.error(`Error processing registry ${registry.instanceName}:`, error);
                await this.registryRepository.updateRegistry({
                    id: registry.id,
                    status: "INACTIVE"
                });
            }
        }

        setTimeout(() => this.processQueue(), 600000);
    }

    private async resolveDNS(instanceName: string): Promise<{ host: string; port: string }> {
        try{
            const dnsResolution = await this.dnsServiceClient.resolve(instanceName);
            return {
                host: dnsResolution.host,
                port: dnsResolution.port
            };
        } catch (error) {
            console.error(`Error resolving DNS for ${instanceName}:`, error);
            throw error;
        }
    }

    private async checkServiceHealth(host: string, port: string): Promise<string> {
        try {
            const serviceResponse = await this.targetServiceClient.send({ host, port });
            return serviceResponse.health;
        } catch (error) {
            console.error(`Error checking health for ${host}:${port}:`, error);
            throw error;
        }
    }
}
