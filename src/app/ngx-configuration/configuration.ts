import { ConfigurationProvider } from './configuration-provider';
import { InjectionToken } from '@angular/core';

export class Configuration<TConfiguration> {
    constructor(private provider: ConfigurationProvider<TConfiguration>) { }

    /**
     * Retrieves the current configuration value.
     */
    public value(): TConfiguration {
        return this.provider.getConfig();
    }
}

export function CreateConfiguration<TConfiguration>(provider: ConfigurationProvider<TConfiguration>) {
    return new Configuration<TConfiguration>(provider);
}

export const CONFIGURATION_FACTORY: InjectionToken<((provider: ConfigurationProvider<any>) => PromiseLike<any>)[]>
    = new InjectionToken('NGX_CONFIGURATION_FACTORY');
