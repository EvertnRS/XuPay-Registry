import { prismaClient } from '@/infra/database/prismaClient';
import { IRegistryRepository } from './IRegistryRepository';
import { RegistryInstance } from '../entity/Registry';
import { InstanceStatus } from "@/infra/database/generated/enums";

export class RegistryRepositoryImpl implements IRegistryRepository {
    public async createRegistry(registry: Omit<RegistryInstance, 'id'| 'status' | 'createdAt'>): Promise<any> {
        return await prismaClient.registryInstance.create({
            data: {
                service: registry.service,
                instanceName: registry.instanceName
            }
        });
    }
    
    public async updateRegistry(registry: Omit<RegistryInstance, 'service'| 'instanceName' | 'createdAt'>): Promise<any> {
        return await prismaClient.registryInstance.update({
            where: { id: registry.id },
            data: {
                status: registry.status,
            }
        });
    }

    public async deleteRegistry(registry: Omit<RegistryInstance, 'service'| 'instanceName' | 'createdAt' | 'status'>): Promise<void> {
        await prismaClient.registryInstance.delete({
            where: { id:registry.id }
        });
    }

    public async findByService(registry: Omit<RegistryInstance, 'id'| 'instanceName' | 'createdAt' | 'status'>): Promise<Array<RegistryInstance>> {
        return await prismaClient.registryInstance.findMany({
            where: {
                service: registry.service,
                status: InstanceStatus.ACTIVE
            }
        });
    }
}