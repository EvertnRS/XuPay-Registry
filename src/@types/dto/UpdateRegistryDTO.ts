import { InstanceStatus } from "@/infra/database/generated/enums";

export type UpdateRegistryDTO = {
    id: string;
    ip: string;
    port: number;
    status: InstanceStatus;
    lastHeartbeat: Date;
}