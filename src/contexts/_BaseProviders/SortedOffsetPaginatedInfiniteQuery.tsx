'use client';

import { useMemo, useState } from 'react';

import {
	OffsetPaginatedInfiniteQueryProvider,
	OffsetPaginatedInfiniteQueryProviderProps,
} from '@/contexts';
import {
	SortDirection,
	SortedOffsetPaginatedInfiniteContextState,
	SortedOffsetPaginatedProviderProps,
} from '@/types';

export interface SortedOffsetPaginatedInfiniteQueryProviderProps<
	T extends SortedOffsetPaginatedInfiniteContextState<unknown>,
> extends SortedOffsetPaginatedProviderProps,
		Pick<OffsetPaginatedInfiniteQueryProviderProps<T>, 'context' | 'defaultData' | 'queryKey'>,
		Record<string, unknown> {
	queryFn: (
		perPage: number,
		sortBy: string | null,
		sortDirection: SortDirection | null,
	) => (params: { pageParam: unknown }) => Promise<unknown>;
}
export const SortedOffsetPaginatedInfiniteQueryProvider = <
	T extends SortedOffsetPaginatedInfiniteContextState<unknown>,
>({
	defaultSortBy,
	defaultSortDirection,
	defaultData,
	queryKey,
	queryFn,
	...props
}: SortedOffsetPaginatedInfiniteQueryProviderProps<T>) => {
	const [sortBy, setSortBy] = useState(defaultSortBy || defaultData.sortBy);
	const [sortDirection, setSortDirection] = useState(
		defaultSortDirection || defaultData.sortDirection,
	);

	//	Add page and perPage to the query key and function
	const paginatedQueryKey = useMemo(
		() => [...queryKey, sortBy, sortDirection],
		[queryKey, sortBy, sortDirection],
	);
	const paginatedQueryFn = useMemo<OffsetPaginatedInfiniteQueryProviderProps<T>['queryFn']>(
		() => (perPage) => queryFn(perPage, sortBy, sortDirection),
		[queryFn, sortBy, sortDirection],
	);

	return (
		<OffsetPaginatedInfiniteQueryProvider
			defaultData={defaultData}
			queryKey={paginatedQueryKey}
			queryFn={paginatedQueryFn}
			sortBy={sortBy}
			setSortBy={setSortBy}
			sortDirection={sortDirection}
			setSortDirection={setSortDirection}
			{...props}
		/>
	);
};
