import {ContainerModule} from 'inversify';
import {IPubSubConfig, PubSubConfig, PubSubService} from './pub_sup_service';

export class PubSubModule extends ContainerModule {

	constructor(config: IPubSubConfig) {
		super((bind) => {
			bind(PubSubService).toSelf().inSingletonScope();
			bind<IPubSubConfig>(PubSubConfig).toConstantValue(config);
		});
	}
}
