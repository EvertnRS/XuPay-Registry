import { InstanceStatus } from "@/infra/database/generated/enums";

export type RegisterInstanceDTO = {
    instanceName: string;
    event: string;
    ip: string;
    port: number;
    path: string;
    status: InstanceStatus;
    lastHeartbeat: Date;
};