'use client';

import { Context } from 'react';

import { ContextState, CoreProviderProps } from '@/types';
import { keepPreviousData, skipToken, useQuery } from '@tanstack/react-query';

export interface QueryProviderProps<T extends ContextState<unknown>> extends CoreProviderProps {
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
	disabled,
	children,
	...props
}: QueryProviderProps<T>) => {
	const queryResults = useQuery({
		queryKey,
		queryFn: disabled ? skipToken : async () => {
			const fn = queryFn();
			return await fn();
		},
		placeholderData: keepPreviousData,
	});

	return (
		<context.Provider
			value={
				{
					data: queryResults.data || defaultData.data,
					error: queryResults.error,
					isLoading: queryResults.isLoading,
					isFetching: queryResults.isFetching,
					isError: queryResults.isError,
					isSuccess: queryResults.isSuccess,
					...props,
				} as T
			}
			children={children}
		/>
	);
};
