import {PubSubEvent} from "./types";
import {RuntimeOptions as BaseOptions} from "firebase-functions";
import * as functions from "firebase-functions";
import {SUPPORTED_REGIONS} from "firebase-functions/lib/function-configuration";

export interface RuntimeOptions extends BaseOptions {
    regions?: typeof SUPPORTED_REGIONS[number][]
}

type PubSubFunctionCallback<T> = (data: T) => Promise<any> | any;

export function createPubSubFunction<T>(event: PubSubEvent<T>, callback: PubSubFunctionCallback<T>);
export function createPubSubFunction<T>(event: PubSubEvent<T>,
                                        runtimeOptions: RuntimeOptions,
                                        callback: PubSubFunctionCallback<T>)

export function createPubSubFunction<T>(event: PubSubEvent<T>,
                                        runtimeOptionsOrCallback: RuntimeOptions | PubSubFunctionCallback<T>,
                                        callback?: PubSubFunctionCallback<T>) {
    let runtimeOptions: RuntimeOptions = null;
    if (!callback) {
        callback = runtimeOptionsOrCallback as PubSubFunctionCallback<T>;
    } else {
        runtimeOptions = runtimeOptionsOrCallback as RuntimeOptions;
    }

    let builder = runtimeOptions
        ? functions.runWith(runtimeOptions)
        : functions;

    if (runtimeOptions && runtimeOptions.regions) {
        builder = builder.region(...runtimeOptions.regions);
    }

    return builder
        .pubsub.topic(event.topic)
        .onPublish(async (message, context) => {
            const data = event.parseData(message);
            return callback(data);
        });
}
