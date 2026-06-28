import { GetRegistryPayload } from './payload/GetRegistryPayload';
import { UpdateRegistryPayload } from './payload/UpdateRegistryPayload';
import { DeleteRegistryPayload } from './payload/DeleteRegistryPayload';
import { RegisterInstancePayload } from './payload/RegisterInstancePayload';

export type Payload = RegisterInstancePayload | GetRegistryPayload | UpdateRegistryPayload | DeleteRegistryPayload;

export type MessageBody = {
    payload: Payload;
};