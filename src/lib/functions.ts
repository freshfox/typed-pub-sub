import {PubSubEvent} from "./types";
import {RuntimeOptions} from "firebase-functions";
import * as functions from "firebase-functions";

type PubSubFunctionCallback<T> = (data: T) => Promise<any> | any;

export function createPubSubFunction<T>(event: PubSubEvent<T>, callback: PubSubFunctionCallback<T>);
export function createPubSubFunction<T>(event: PubSubEvent<T>, runtimeOptions: RuntimeOptions, callback: PubSubFunctionCallback<T>)
export function createPubSubFunction<T>(event: PubSubEvent<T>, runtimeOptionsOrCallback: RuntimeOptions | PubSubFunctionCallback<T>, callback?: PubSubFunctionCallback<T>) {
    let runtimeOptions: RuntimeOptions = null;
    if (!callback) {
        callback = runtimeOptionsOrCallback as PubSubFunctionCallback<T>;
    } else {
        runtimeOptions = runtimeOptionsOrCallback as RuntimeOptions;
    }

    const builder = runtimeOptions
        ? functions.runWith(runtimeOptions)
        : functions;

    return builder
        .pubsub.topic(event.topic)
        .onPublish(async (message, context) => {
            const data = event.parseData(message);
            return callback(data);
        });
}
