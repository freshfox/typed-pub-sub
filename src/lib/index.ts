import {PubSub} from "@google-cloud/pubsub";

export function publishEvent<T extends PubSubEventPayload>(client: PubSub, event: PubSubEvent<T>) {
    return client.topic(event.topic).publishMessage({
        json: event.data || {}
    });
}

export type PubSubEventPayload = object | void;

export interface PubSubEventCreator<T extends PubSubEventPayload> {
    (data: T): PubSubEvent<T>;
    topic: string;
    validate?: (data: object) => T
}

export interface PubSubEvent<T extends PubSubEventPayload> {
    topic: string;
    data: T;
}

export function createPubSubEvent<T extends PubSubEventPayload>(topic: string, validate?: (data: object) => T): PubSubEventCreator<T> {
    return Object.assign(
        (data: T) => {
            return {
                data, topic
            };
        },
        {
            topic: topic,
            validate: validate
        }
    );
}

const AEvent = createPubSubEvent('asd');
AEvent({});