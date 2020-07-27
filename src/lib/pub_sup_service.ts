import {inject, injectable} from 'inversify';
import {PubSub, Topic} from '@google-cloud/pubsub';
import {PubSubEventData, PubSubEvent} from "./pub_sub_event";

export interface IPubSubConfig {
	projectId: string;
}

export const PubSubConfig = Symbol('PubSubConfig');

@injectable()
export class PubSubService {

	private pubsubClient: PubSub;

	constructor(@inject(PubSubConfig) private config: IPubSubConfig) {
		this.pubsubClient = new PubSub({
			projectId: config.projectId,
		});
	}

	publishMessage<T>(event: PubSubEventData<T>) {
		return this.publish(event.topic, event.payload);
	}

	async publish(topicName: string, data?: any) {
		const topic = await this.getTopic(topicName);
		return topic.publishJSON(data || {});
	}

	getTopic(topicName: string): Topic {
		return this.pubsubClient.topic(topicName);
	}
}
