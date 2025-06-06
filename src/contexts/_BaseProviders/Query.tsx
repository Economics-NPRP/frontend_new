import { Context, PropsWithChildren } from 'react';

import { ContextState } from '@/types';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export interface QueryProviderProps<T extends ContextState<unknown>>
	extends PropsWithChildren,
		Record<string, unknown> {
	context: Context<T>;
	defaultData: T;
	queryKey: string[];
	queryFn: () => Promise<unknown>;
}
export const QueryProvider = <T extends ContextState<unknown>>({
	context,
	defaultData,
	queryKey,
	queryFn,
	children,
	...props
}: QueryProviderProps<T>) => {
	const queryResults = useQuery({
		queryKey,
		queryFn,
		placeholderData: keepPreviousData,
	});

	return (
		<context.Provider
			value={
				{
					data: queryResults.data || defaultData.data,
					isLoading: queryResults.isLoading,
					isError: queryResults.isError,
					isSuccess: queryResults.isSuccess,
					...props,
				} as T
			}
			children={children}
		/>
	);
};
