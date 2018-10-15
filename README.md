# Introduction
This is an environment configuration package for Angular 5+ (we might support Angular 4 in the near future).
It allows you to dynamically load configuration from various sources as hosted json configuration files. 
This json will be loaded before everything else in your App.

# Usecases
For example, in a continuous integration system, we often need different API endpoints between developpment, preproduction, production and so on.
This system will allow you to change this kind of parameter in the configuration file without having to recompile your Typescript code all over.

In other scenario, you might want some configuration settings to be dynamically provided by an API.
This library will cater for that as well.

# Example
To make development and testing easy, this repository is an angular CLI demonstration app.

The actual module sources are contained in the path `src/app/ngx-configuration`.

# How to use it

## Install the module
Install it with npm:
```
npm install gl-ngx-configuration --save
```

Install it with yarn:
```
yarn add gl-ngx-configuration
```

## Create or copy your configuration json file

### Simple way
Add a `configuration.json` file in your src folder containing your env configuration variables.
There is no required key needed, it's your configuration. It will surely contain your api url, your Google Analytics ID and more...
To copy the right configuration for the right environment, you will need a copy executable, as explained in the next section.

### Automatic way (use a copy executable)
I made a simpe executable that will copy the right configuration file for a specified environment:
`copy-env-config.js` which is available [here](https://github.com/geeklearningio/gl-ngx-configuration/blob/master/copy-env-config.js).

Here how to use it:
```
node copy-env-config.js --env YOURENV
```
This will copy the file `src/configuration/YOURENV.json` to `src/configuration.json`

### Even more automatic
Just run this command before your ionic:serve or ionic:build command to specify the right environment configuration to copy.
For example, to build you app in prod and serve in dev, just update your `package.json` scripts like that:
```
"ionic:build": "node copy-env-config.js --env prod | ionic-app-scripts build",
"ionic:serve": "node copy-env-config.js --env dev | ionic-app-scripts serve"
```

## Use the module in your Angular app

```typescript
import { NgModule } from '@angular/core';
import { environment } from 'environments/environment';

// Import the module
import {  CONFIGURATION_FACTORY, ConfigurationProvider, ConfigurationModule } from 'gl-ngx-configuration';

export function configurationFactory() {
  return (config: ConfigurationProvider<any>) => {
    return config.loadDefault(environment); // you can chain several calls
  };
}

@NgModule({
  declarations: [
    //...
  ],
  imports: [
    ConfigurationModule // Import the module here
  ],
  entryComponents: [
    //...
  ],
  providers: [{
      provide: CONFIGURATION_FACTORY,
      useFactory: configurationFactory,
      multi: true
    }]
})
export class AppModule {}
```

## Get the configuration in your app

```typescript
import { Component } from '@angular/core';

// Import the module
import {Configuration} from "gl-ngx-configuration";

// Import your configuration typings
// You can specify a typing for your configuration to get nice and neat autocompletion
import {ITestAppConfiguration} from "../../env-configuration/ITestAppConfiguration";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  // inject the EnvConfigurationProvider and specify the configuration typings
  constructor(private envConfiguration: Configuration<ITestAppEnvConfiguration>) {
    let config: ITestAppEnvConfiguration = envConfiguration.value();
    console.log(config); // And here you have your nice configuration
  }

}
```

## API

```
export class Configuration<TConfiguration> {
    /**
     * Retrieves the current configuration value.
     */
    public value(): TConfiguration;
}

export class ConfigurationProvider<T> {
  
  /**
   * Loads a `configuration.json` file from the application root.
   * @param environment if environment is provided and a deployUrl settings is set it will use it.
   */
  loadDefault(environment?: any): Promise<boolean>;

  /**
   * Loads a json file from a specified Url.
   * @param url url to download the configuration from
   */
  loadUrl(url: string): Promise<boolean>;

  /**
   * Merges an object with the current configuration
   * @param obj obj or promise to merge with the current configuration
   */
  public merge(obj: Partial<T> | Promise<Partial<T>>): Promise<boolean>;

  /**
   * Retrieves the current configuration value.
   * @returns the current merged configuration value
   */
  public getConfig(): T {
    return this.mergedConfiguration;
  }
}
```

## How it works
This modules uses an `APP_INITIALIZERS` to load the `ConfigurationProvider` and execute the `CONFIGURATION_FACTORY` you provides. It basically tells Angular to wait for this provider to load the configuration json file before executing anything else.

So for example, your API service will have the right endpoint even in its constructor.

To learn more about this specific loading, you can see this [discussion](https://github.com/angular/angular/issues/9047#issuecomment-224075188) and this [GIST file](https://gist.github.com/fernandohu/122e88c3bcd210bbe41c608c36306db9).
