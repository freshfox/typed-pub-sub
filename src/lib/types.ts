import {Message} from "firebase-functions/lib/providers/pubsub";

export class PubSubEvent<T> implements PubSubEventDescription<T>{

    readonly topic: string;
    readonly arguments: EventArguments<T>;

    constructor(desc: PubSubEventDescription<T>) {
        Object.assign(this, desc);
    }

    static make<T>(topic: string, args?: EventArguments<T>) {
        return new PubSubEvent<T>({
            topic: topic,
            arguments: args
        });
    }

    parseData(message: Message): T {
        return message.json;
    }

    create(data: T): PubSubEventData<T> {
        return {
            topic: this.topic,
            payload: data
        }
    }
}

export interface PubSubEventData<T> {
    topic: string;
    payload: T
}

export interface PubSubEventDescription<T> {
    topic: string;
    arguments?: EventArguments<T>
}

export type EventArguments<T> = {
    [K in keyof Required<T>]: 'string' | 'boolean' | any
}

export interface IPubSubConfig {
    projectId: string;
}

export const PubSubConfig = Symbol('PubSubConfig');
