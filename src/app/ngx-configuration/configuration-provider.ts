import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable()
export class ConfigurationProvider<T> {

    private mergedConfiguration: T = <T>{};

    loadDefault(environment?: any): Promise<boolean> {
        const url = environment && environment.deployUrl ? environment.deployUrl + 'configuration.json' : 'configuration.json';

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
      console.log('merging:', obj);
      this.mergedConfiguration = <T>_.merge(this.mergedConfiguration, obj);
    }

    public merge(obj: Partial<T> | Promise<Partial<T>>): Promise<boolean> {
        const promisyfied = Promise.resolve(obj);
        return promisyfied.then(result => {
            if (result) {
                this._merge(result);
                return true;
            }
            console.log('Object was undefined and could not be merged to the configuration');
            return false;
        });
    }

    public getConfig() {
        return this.mergedConfiguration;
    }
}
