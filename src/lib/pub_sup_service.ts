import {inject, injectable} from 'inversify';
import {PubSub, Topic} from '@google-cloud/pubsub';
import {IPubSubConfig, PubSubConfig, PubSubEventData} from "./types";

@injectable()
export class PubSubService {

    private readonly pubsubClient: PubSub;

    constructor(@inject(PubSubConfig) private config: IPubSubConfig) {
        this.pubsubClient = new PubSub({
            projectId: config.projectId,
        });
    }

    publishMessage<T>(event: PubSubEventData<T>) {
        return this.publish(event.topic, event.payload);
    }

    async publish(topicName: string, data?: any) {
        const topic = this.getTopic(topicName);
        return topic.publishJSON(data || {});
    }

    getTopic(topicName: string): Topic {
        return this.pubsubClient.topic(topicName);
    }

    getClient() {
        return this.pubsubClient;
    }
}
