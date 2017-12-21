import { ConfigurationProvider } from './../providers/configuration-provider';

export class Configuration<TConfiguration> {
    constructor(private provider: ConfigurationProvider<TConfiguration>) { }

    public value(): TConfiguration {
        return this.provider.getConfig();
    }
}

export function CreateConfiguration<TConfiguration>(provider: ConfigurationProvider<TConfiguration>) {
    return new Configuration<TConfiguration>(provider);
}

export function ConfigurationFactory(config: ConfigurationProvider<any>) {
    config.addConfig({
        api: {
            hostName: document.location.hostname,
            port: document.location.port,
            protocol: document.location.protocol.replace(':', '')
        }
    });
    return () => config.load()
        .then(() => config.getConfig().api)
        .then(api => config.addConfig({ apiUri: `${api.protocol}://${api.hostName}${api.port ? `:${api.port}` : ''}` }))
        .then(() => config.loadUrl(`${config.getConfig().apiUri}/api/configuration/frontend`));
}
