import { prismaClient } from '@/infra/database/prismaClient';
import { IRegistryRepository } from './IRegistryRepository';
import { RegistryInstance } from '../entity/Registry';
import { InstanceStatus } from "@/infra/database/generated/enums";
import { UpdateRegistryDTO } from '@/@types/dto/UpdateRegistryDTO';
import { RegisterInstanceDTO } from '@/@types/dto/RegisterInstanceDTO';

export class RegistryRepositoryImpl implements IRegistryRepository {
    /*public async createRegistry(data: CreateRegistryDTO): Promise<any> {
        return await prismaClient.registryInstance.create({
            data: {
                event: data.event,
                instanceName: data.instanceName,
                path: data.path
            }
        });
    }*/

    public async registerInstance(data: RegisterInstanceDTO): Promise<RegistryInstance> {
        return await prismaClient.registryInstance.create({
            data: {
                instanceName: data.instanceName,
                event: data.event,
                ip: data.ip,
                port: data.port,
                status: data.status,
                lastHeartBeat: data.lastHeartbeat
            }
        });
    }

    public async updateRegistry(data: UpdateRegistryDTO): Promise<any> {
        return await prismaClient.registryInstance.update({
            where: { id: data.id },
            data: {
                ip: data.ip,
                port: data.port,
                status: data.status,
                lastHeartBeat: data.lastHeartbeat
            }
        });
    }

    public async deleteRegistry(id: string): Promise<void> {
        await prismaClient.registryInstance.delete({
            where: { id: id }
        });
    }

    public async findByEvent(event: string): Promise<Array<RegistryInstance>> {
        return await prismaClient.registryInstance.findMany({
            where: {
                event: event,
                status: InstanceStatus.ACTIVE
            }
        });
    }

    public async findByInstanceName(instanceName: string): Promise<RegistryInstance | null> {
        return await prismaClient.registryInstance.findFirst({
            where: {
                instanceName: instanceName,
                status: InstanceStatus.ACTIVE
            }
        });
    }

    findByPort(port: number): Promise<RegistryInstance | null> {
        return prismaClient.registryInstance.findFirst({
            where: {
                port: port,
                status: InstanceStatus.ACTIVE
            }
        });
    }
}