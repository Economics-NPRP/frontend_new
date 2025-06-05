import { ComponentType, ReactElement } from 'react';

type WithProvidersParams = (
	component: ReactElement,
	...providers: Array<{
		provider: ComponentType<{ children: React.ReactNode }>;
		props?: Record<string, unknown>;
	}>
) => ReactElement;

export const withProviders: WithProvidersParams = (component, ...providers) =>
	providers.reduce(
		(children, { provider: Provider, props }) => <Provider {...props}>{children}</Provider>,
		component,
	);
