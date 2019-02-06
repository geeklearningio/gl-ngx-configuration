import {
  APP_INITIALIZER,
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule
} from '@angular/core';

import {
  Configuration,
  CONFIGURATION_FACTORY,
  CreateConfiguration
} from './configuration';
import { ConfigurationProvider } from './configuration-provider';

export function InternalConfigurationFactory(
  config: ConfigurationProvider<any>,
  factory: ((provider: ConfigurationProvider<any>) => PromiseLike<any>)[]
) {
  // There's a bug on Angular and requires to assign to a function instead of returning the factory directly
  // https://github.com/angular/angular/issues/14485#issuecomment-279849202
  const res = () => factory[0](config);
  return res;
}

@NgModule({
  providers: [
    ConfigurationProvider,
    {
      provide: APP_INITIALIZER,
      useFactory: InternalConfigurationFactory,
      deps: [ConfigurationProvider, CONFIGURATION_FACTORY],
      multi: true
    },
    {
      provide: Configuration,
      useFactory: CreateConfiguration,
      deps: [ConfigurationProvider]
    }
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ConfigurationModule {}
