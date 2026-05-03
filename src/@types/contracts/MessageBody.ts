import { CreateRegistryPayload } from './CreateRegistryPayload';
import { GetRegistryPayload } from './GetRegistryPayload';
import { UpdateRegistryPayload } from './UpdateRegistryPayload';
import { DeleteRegistryPayload } from './DeleteRegistryPayload';

export type Payload = CreateRegistryPayload | GetRegistryPayload | UpdateRegistryPayload | DeleteRegistryPayload;

export type MessageBody = {
    source: string;
    type: string;
    payload: Payload;
    timestamp: string;
};