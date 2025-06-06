'use client';

import { useMemo, useState } from 'react';

import { OffsetPaginatedQueryProvider, OffsetPaginatedQueryProviderProps } from '@/contexts';
import {
	SortDirection,
	SortedOffsetPaginatedContextState,
	SortedOffsetPaginatedProviderProps,
} from '@/types';

export interface SortedOffsetPaginatedQueryProviderProps<
	T extends SortedOffsetPaginatedContextState<unknown>,
> extends SortedOffsetPaginatedProviderProps,
		Pick<OffsetPaginatedQueryProviderProps<T>, 'context' | 'defaultData' | 'queryKey'>,
		Record<string, unknown> {
	queryFn: (
		page: number,
		perPage: number,
		sortBy: string | null,
		sortDirection: SortDirection | null,
	) => () => Promise<unknown>;
}
export const SortedOffsetPaginatedQueryProvider = <
	T extends SortedOffsetPaginatedContextState<unknown>,
>({
	defaultSortBy,
	defaultSortDirection,
	context,
	defaultData,
	queryKey,
	queryFn,
	children,
	...props
}: SortedOffsetPaginatedQueryProviderProps<T>) => {
	const [sortBy, setSortBy] = useState(defaultSortBy || defaultData.sortBy);
	const [sortDirection, setSortDirection] = useState(
		defaultSortDirection || defaultData.sortDirection,
	);

	//	Add page and perPage to the query key and function
	const paginatedQueryKey = useMemo(
		() => [...queryKey, sortBy, sortDirection],
		[queryKey, sortBy, sortDirection],
	);
	const paginatedQueryFn = useMemo<OffsetPaginatedQueryProviderProps<T>['queryFn']>(
		() => (page, perPage) => queryFn(page, perPage, sortBy, sortDirection),
		[queryFn, sortBy, sortDirection],
	);

	return (
		<OffsetPaginatedQueryProvider
			context={context}
			defaultData={defaultData}
			queryKey={paginatedQueryKey}
			queryFn={paginatedQueryFn}
			children={children}
			sortBy={sortBy}
			setSortBy={setSortBy}
			sortDirection={sortDirection}
			setSortDirection={setSortDirection}
			{...props}
		/>
	);
};
