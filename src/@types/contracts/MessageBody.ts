import { CreateRegistryPayload } from './payload/CreateRegistryPayload';
import { GetRegistryPayload } from './payload/GetRegistryPayload';
import { UpdateRegistryPayload } from './payload/UpdateRegistryPayload';
import { DeleteRegistryPayload } from './payload/DeleteRegistryPayload';
import { ServicePayload } from './payload/ServicePayload';
import { DNSServicePayload } from './payload/DNSServicePayload';

export type Payload = CreateRegistryPayload | GetRegistryPayload | UpdateRegistryPayload | DeleteRegistryPayload | ServicePayload | DNSServicePayload;

export type MessageBody = {
    payload: Payload;
};