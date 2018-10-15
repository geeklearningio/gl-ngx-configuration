import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { CONFIGURATION_FACTORY, ConfigurationProvider, ConfigurationModule } from './ngx-configuration/public-api';


export function ConfigureFactory() {
  return (config: ConfigurationProvider<any>) => {
    return config.loadDefault().then(x => config.merge({ settingB: 'Anothervalue' }));
  };
}


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    EnvironmentConfigurationModule
  ],
  providers: [{
    provide: CONFIGURATION_FACTORY,
    useFactory: ConfigureFactory,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
