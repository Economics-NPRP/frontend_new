'use client';

import { Context, PropsWithChildren, useMemo } from 'react';

import { ContextState } from '@/types';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export interface QueryProviderProps<T extends ContextState<unknown>>
	extends PropsWithChildren,
		Record<string, unknown> {
	context: Context<T>;
	defaultData: T;
	queryKey: Array<string | number | boolean | undefined | null>;
	queryFn: () => () => Promise<unknown>;
}
export const QueryProvider = <T extends ContextState<unknown>>({
	context,
	defaultData,
	queryKey,
	queryFn,
	children,
	...props
}: QueryProviderProps<T>) => {
	const memoizedQueryFn = useMemo(() => queryFn(), [queryFn]);

	const queryResults = useQuery({
		queryKey,
		queryFn: memoizedQueryFn,
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
