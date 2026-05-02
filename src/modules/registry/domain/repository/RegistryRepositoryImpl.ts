import { prismaClient } from '@/infra/database/prismaClient';
import { IRegistryRepository } from './IRegistryRepository';
import { RegistryInstance } from '../entity/Registry';
import { InstanceStatus } from "@/infra/database/generated/enums";

export class RegistryRepositoryImpl implements IRegistryRepository {
    public async createRegistry(target:string, instanceName:string): Promise<any> {
        return await prismaClient.registryInstance.create({
            data: {
                target,
                instanceName
            }
        });
    }
    
    public async updateRegistry(id: string, target:string, instanceName:string, status:InstanceStatus): Promise<any> {
        return await prismaClient.registryInstance.update({
            where: { id },
            data: {
                target,
                instanceName,
                status
            }
        });
    }

    public async deleteRegistry(id: string): Promise<void> {
        await prismaClient.registryInstance.delete({
            where: { id }
        });
    }

    public async findByTarget(target: string): Promise<Array<RegistryInstance>> {
        return await prismaClient.registryInstance.findMany({
            where: {
                target: target,
                status: InstanceStatus.ACTIVE
            }
        });
    }
}