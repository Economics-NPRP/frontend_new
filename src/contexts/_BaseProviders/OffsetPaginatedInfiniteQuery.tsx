'use client';

import { useMemo, useState } from 'react';

import { QueryProviderProps } from '@/contexts';
import {
	OffsetPaginatedData,
	OffsetPaginatedInfiniteContextState,
	OffsetPaginatedProviderProps,
} from '@/types';
import { useInfiniteQuery } from '@tanstack/react-query';

export interface OffsetPaginatedInfiniteQueryProviderProps<
	T extends OffsetPaginatedInfiniteContextState<unknown>,
> extends OffsetPaginatedProviderProps,
		Pick<QueryProviderProps<T>, 'context' | 'defaultData' | 'queryKey'>,
		Record<string, unknown> {
	queryFn: (perPage: number) => (params: { pageParam: unknown }) => Promise<unknown>;
}
export const OffsetPaginatedInfiniteQueryProvider = <
	T extends OffsetPaginatedInfiniteContextState<unknown>,
>({
	defaultPage,
	defaultPerPage,
	context,
	defaultData,
	queryKey,
	queryFn,
	children,
	...props
}: OffsetPaginatedInfiniteQueryProviderProps<T>) => {
	const [perPage, setPerPage] = useState(defaultPerPage || defaultData.perPage);

	//	Add page and perPage to the query key and function
	const paginatedQueryKey = useMemo(() => [...queryKey, perPage], [queryKey, perPage]);
	const paginatedQueryFn = useMemo(() => queryFn(perPage), [queryFn, perPage]);

	const queryResults = useInfiniteQuery({
		queryKey: paginatedQueryKey,
		queryFn: paginatedQueryFn,
		initialPageParam: defaultPage,
		getNextPageParam: (prevResult) =>
			(prevResult as OffsetPaginatedData<unknown>) &&
			(prevResult as OffsetPaginatedData<unknown>).page + 1 >
				(prevResult as OffsetPaginatedData<unknown>).pageCount
				? undefined
				: (prevResult as OffsetPaginatedData<unknown>).page + 1,
	});

	return (
		<context.Provider
			value={
				{
					data: queryResults.data || defaultData.data,
					isLoading: queryResults.isLoading,
					isError: queryResults.isError,
					isSuccess: queryResults.isSuccess,
					isFetchingNextPage: queryResults.isFetchingNextPage,
					hasNextPage: queryResults.hasNextPage,
					fetchNextPage: queryResults.fetchNextPage,
					perPage,
					setPerPage,
					...props,
				} as unknown as T
			}
			children={children}
		/>
	);
};
