import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CONFIGURATION_FACTORY, ConfigurationModule, ConfigurationProvider } from './ngx-configuration/public-api';

export function ConfigureFactory() {
  return (config: ConfigurationProvider<any>) => {
    return config
      .loadDefault()
      .then(x => config.merge({ settingB: 'Anothervalue' }));
  };
}

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, ConfigurationModule],
  providers: [
    {
      provide: CONFIGURATION_FACTORY,
      useFactory: ConfigureFactory,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
