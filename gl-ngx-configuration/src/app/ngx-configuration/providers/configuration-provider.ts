import { Injectable } from '@angular/core';
import { merge } from 'lodash';
import { environment } from 'environments/environment';

@Injectable()
export class ConfigurationProvider<T> {

    private mergedConfiguration: T = <T>{};

    load(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const xobj = new XMLHttpRequest();
            xobj.overrideMimeType('application/json');
            xobj.open('GET', environment.deployUrl + 'env-configuration.json', true);
            xobj.onreadystatechange = () => {
                if (xobj.readyState === 4) {
                    if ((xobj.status === 200 || xobj.status === 0) && xobj.responseText) {
                        this.addConfig(<T>JSON.parse(xobj.responseText));
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
                        this.addConfig(<T>JSON.parse(xobj.responseText));
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

    public addConfig(obj: T) {
        if (obj) {
            this.mergedConfiguration = <T>merge(this.mergedConfiguration, obj);
        }
    }

    public getConfig() {
        return this.mergedConfiguration;
    }
}
