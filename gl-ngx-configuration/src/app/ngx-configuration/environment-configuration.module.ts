import { NgModule, CUSTOM_ELEMENTS_SCHEMA, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ConfigurationProvider } from './providers/configuration-provider';
import { Configuration, ConfigurationFactory, CreateConfiguration } from './helpers/configuration-helper';

@NgModule({
  providers: [
    ConfigurationProvider,
    {
      provide: APP_INITIALIZER,
      useFactory: ConfigurationFactory,
      deps: [ConfigurationProvider],
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
export class EnvironmentConfigurationModule { }
