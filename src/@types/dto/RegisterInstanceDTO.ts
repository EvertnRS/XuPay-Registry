import { InstanceStatus } from "@/infra/database/generated/enums";

export type RegisterInstanceDTO = {
    instanceName: string;
    event: string;
    ip: string;
    port: number;
    status: InstanceStatus;
    lastHeartbeat: Date;
};