import { Component } from '@angular/core';
import { Configuration } from 'gl-ngx-configuration';

export interface MyConfiguration {
  settingA: string;
  settingB: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  config: MyConfiguration;

  constructor(configuration: Configuration<MyConfiguration>) {
    this.config = configuration.value();
  }
}
