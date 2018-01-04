import { ConfigurationProvider } from './configuration-provider';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CONFIGURATION_FACTORY, CreateConfiguration, Configuration } from './configuration';

function InternalConfigurationFactory(
  config: ConfigurationProvider<any>,
  factory: ((provider: ConfigurationProvider<any>) => PromiseLike<any>)[]) {
  return () => factory[0](config);
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
export class ConfigurationModule { }
