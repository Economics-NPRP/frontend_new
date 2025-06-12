'use client';

import { MyUserProvider } from 'contexts/MyUser';
import { ComponentPropsWithRef } from 'react';

import { withProviders } from '@/helpers';
import { theme } from '@/styles/mantine';
import { DirectionProvider, MantineProvider } from '@mantine/core';
import { QueryClient, QueryClientProvider, isServer } from '@tanstack/react-query';

function makeQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 60 * 1000,
			},
		},
	});
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
	if (isServer) {
		return makeQueryClient();
	} else {
		if (!browserQueryClient) browserQueryClient = makeQueryClient();
		return browserQueryClient;
	}
}

export interface ProvidersProps extends ComponentPropsWithRef<'div'> {}
export default function Providers({ children }: ProvidersProps) {
	const queryClient = getQueryClient();

	return withProviders(
		<>{children}</>,
		{ provider: MyUserProvider },
		{ provider: MantineProvider, props: { theme } },
		{ provider: DirectionProvider },
		{ provider: QueryClientProvider, props: { client: queryClient } },
	);
}
