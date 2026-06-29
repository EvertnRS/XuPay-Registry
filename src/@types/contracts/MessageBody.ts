import { GetRegistryPayload } from './payload/GetRegistryPayload';
import { UpdateRegistryPayload } from './payload/UpdateRegistryPayload';
import { DeleteRegistryPayload } from './payload/DeleteRegistryPayload';
import { RegisterInstancePayload } from './payload/RegisterInstancePayload';
import { DNSServicePayload } from './payload/DNSClientPayload';

export type Payload = RegisterInstancePayload | GetRegistryPayload | UpdateRegistryPayload | DeleteRegistryPayload | DNSServicePayload;

export type MessageBody = {
    payload: Payload;
};