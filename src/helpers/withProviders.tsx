import { ComponentType, PropsWithChildren, ReactElement } from 'react';

interface ProviderConfig<T> {
	provider: ComponentType<PropsWithChildren<T>>;
	props?: T;
}

type WithProvidersParams = (
	component: ReactElement,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	...providers: Array<ProviderConfig<any>>
) => ReactElement;

export const withProviders: WithProvidersParams = (component, ...providers) =>
	providers.reduce(
		(children, { provider: Provider, props }) => <Provider {...props}>{children}</Provider>,
		component,
	);
