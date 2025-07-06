'use client';

import { Context, PropsWithChildren, useEffect, useMemo } from 'react';

import { ContextState } from '@/types';
import { keepPreviousData, skipToken, useQuery } from '@tanstack/react-query';

export interface QueryProviderProps<T extends ContextState<unknown>>
	extends PropsWithChildren,
		Record<string, unknown> {
	context: Context<T>;
	defaultData: T;
	queryKey: Array<string | number | boolean | undefined | null>;
	queryFn: () => () => Promise<unknown>;
	disabled?: boolean;
}
export const QueryProvider = <T extends ContextState<unknown>>({
	context,
	defaultData,
	queryKey,
	queryFn,
	disabled,
	children,
	...props
}: QueryProviderProps<T>) => {
	const memoizedQueryFn = useMemo(() => queryFn(), [queryFn]);

	const queryResults = useQuery({
		queryKey,
		queryFn: disabled ? skipToken : memoizedQueryFn,
		placeholderData: keepPreviousData,
	});

	useEffect(() => {
		if (!queryKey.includes('allCycleAdmins')) return;
		console.log(queryResults);
	}, [queryKey, queryResults]);

	return (
		<context.Provider
			value={
				{
					data: queryResults.data || defaultData.data,
					error: queryResults.error,
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
