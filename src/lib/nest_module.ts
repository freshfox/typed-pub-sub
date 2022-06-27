import {DynamicModule, FactoryProvider, ModuleMetadata, Provider, Type} from "@nestjs/common";
import {IPubSubConfig, PubSubConfig} from "./types";
import {PubSubService} from "./pub_sup_service";

export class PubSubNestModule {

    static forRootAsync(options: PubSubModuleAsyncOptions): DynamicModule {
        return {
            imports: options.imports || [],
            module: PubSubNestModule,
            providers: [
                PubSubService,
                ...this.createConnectProviders(options)
            ],
            exports: [
                PubSubService
            ],
        };
    }

    private static createConnectProviders(
        options: PubSubModuleAsyncOptions,
    ): Provider[] {
        if (options.useExisting || options.useFactory) {
            return [this.createConnectOptionsProvider(options)];
        }

        // for useClass
        return [
            this.createConnectOptionsProvider(options),
            {
                provide: options.useClass!,
                useClass: options.useClass!,
            },
        ];
    }

    private static createConnectOptionsProvider(
        options: PubSubModuleAsyncOptions,
    ): Provider {
        if (options.useFactory) {

            // for useFactory
            return {
                provide: PubSubConfig,
                useFactory: options.useFactory,
                inject: options.inject || [],
            };
        }

        // For useExisting...
        return {
            provide: PubSubConfig,
            useFactory: async (optionsFactory: PubSubOptionsFactory) =>
                await optionsFactory.createPubSubOptions(),
            inject: [options.useExisting || options.useClass!],
        };
    }

}

export interface PubSubOptionsFactory {
    createPubSubOptions(): Promise<IPubSubConfig> | IPubSubConfig;
}

export interface PubSubModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {

    /**
     * Existing Provider to be used.
     */
    useExisting?: Type<PubSubOptionsFactory>;

    /**
     * Type (class name) of provider (instance to be registered and injected).
     */
    useClass?: Type<PubSubOptionsFactory>;

    /**
     * Factory function that returns an instance of the provider to be injected.
     */
    useFactory?: (
        ...args: any[]
    ) => Promise<IPubSubConfig> | IPubSubConfig;

    /**
     * Optional list of providers to be injected into the context of the Factory function.
     */
    inject?: FactoryProvider['inject'];
}
