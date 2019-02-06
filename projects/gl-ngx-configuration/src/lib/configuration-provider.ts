import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable()
export class ConfigurationProvider<T> {
  private mergedConfiguration: T = <T>{};

  /**
   * Loads a `configuration.json` file from the application root.
   * @param environment if environment is provided and a deployUrl settings is set it will use it.
   */
  loadDefault(environment?: any): Promise<boolean> {
    const url =
      environment && environment.deployUrl
        ? environment.deployUrl + 'configuration.json'
        : 'configuration.json';

    return new Promise((resolve, reject) => {
      const xobj = new XMLHttpRequest();
      xobj.overrideMimeType('application/json');
      xobj.open('GET', url, true);
      xobj.onreadystatechange = () => {
        if (xobj.readyState === 4) {
          if ((xobj.status === 200 || xobj.status === 0) && xobj.responseText) {
            this._merge(<T>JSON.parse(xobj.responseText));
            resolve(true);
          } else {
            console.log('Could not load environment configuration file');
            resolve(false); // don't reject the promise, as it would completely break the app loading
          }
        }
      };
      xobj.send(null);
    });
  }

  /**
   * Loads a json file from a specified Url.
   * @param url url to download the configuration from
   */
  loadUrl(url: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const xobj = new XMLHttpRequest();
      xobj.overrideMimeType('application/json');
      xobj.open('GET', url, true);
      xobj.onreadystatechange = () => {
        if (xobj.readyState === 4) {
          if ((xobj.status === 200 || xobj.status === 0) && xobj.responseText) {
            this._merge(<T>JSON.parse(xobj.responseText));
            resolve(true);
          } else {
            console.log('Could not load environment configuration file');
            resolve(false); // don't reject the promise, as it would completely break the app loading
          }
        }
      };
      xobj.send(null);
    });
  }

  private _merge(obj: Partial<T>) {
    this.mergedConfiguration = <T>_.merge(this.mergedConfiguration, obj);
  }

  /**
   * Merges an object with the current configuration
   * @param obj obj or promise to merge with the current configuration
   */
  public merge(obj: Partial<T> | Promise<Partial<T>>): Promise<boolean> {
    const promisyfied = Promise.resolve(obj);
    return promisyfied.then(result => {
      if (result) {
        this._merge(result);
        return true;
      }
      console.log(
        'Object was undefined and could not be merged to the configuration'
      );
      return false;
    });
  }

  /**
   * Retrieves the current configuration value.
   * @returns the current merged configuration value
   */
  public getConfig(): T {
    return this.mergedConfiguration;
  }
}
