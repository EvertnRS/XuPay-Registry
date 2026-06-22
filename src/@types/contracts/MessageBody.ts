import { CreateRegistryPayload } from './payload/CreateRegistryPayload';
import { GetRegistryPayload } from './payload/GetRegistryPayload';
import { UpdateRegistryPayload } from './payload/UpdateRegistryPayload';
import { DeleteRegistryPayload } from './payload/DeleteRegistryPayload';

export type Payload = CreateRegistryPayload | GetRegistryPayload | UpdateRegistryPayload | DeleteRegistryPayload;

export type MessageBody = {
    payload: Payload;
};