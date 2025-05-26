'use client';

import { ComponentPropsWithRef } from 'react';

import GlobalContext from '@/pages/globalContext';
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

	return (
		<QueryClientProvider client={queryClient}>
			<DirectionProvider>
				<MantineProvider theme={theme}>
					<GlobalContext>{children}</GlobalContext>
				</MantineProvider>
			</DirectionProvider>
		</QueryClientProvider>
	);
}
