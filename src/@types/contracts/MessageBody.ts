import { Payload } from './Payload';

export type MessageBody = {
    source: string;
    type: string;
    payload: Payload | string;
    timestamp: string;
};