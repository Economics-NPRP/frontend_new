'use client';

import { ParserBuilder, parseAsString } from 'nuqs';
import { useCallback, useMemo } from 'react';

import { OffsetPaginatedQueryProvider, OffsetPaginatedQueryProviderProps } from '@/contexts';
import { useConditionalQueryState } from '@/hooks';
import {
	SortDirection,
	SortedOffsetPaginatedContextState,
	SortedOffsetPaginatedProviderProps,
} from '@/types';

export interface SortedOffsetPaginatedQueryProviderProps<
	T extends SortedOffsetPaginatedContextState<unknown>,
> extends SortedOffsetPaginatedProviderProps,
		Pick<
			OffsetPaginatedQueryProviderProps<T>,
			'context' | 'defaultData' | 'queryKey' | 'id' | 'disabled'
		>,
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
	defaultData,
	queryKey,
	queryFn,
	syncWithSearchParams = false,
	...props
}: SortedOffsetPaginatedQueryProviderProps<T>) => {
	const [sortBy, setSortBy] = useConditionalQueryState({
		key: 'sortBy',
		defaultValue: defaultSortBy || defaultData.sortBy,
		parser: parseAsString as ParserBuilder<string | null>,
		syncWithSearchParams,
	});
	const [sortDirection, setSortDirection] = useConditionalQueryState({
		key: 'sortDirection',
		defaultValue: defaultSortDirection || defaultData.sortDirection,
		parser: parseAsString as ParserBuilder<SortDirection | null>,
		syncWithSearchParams,
	});

	const handleSetSort = useCallback(
		(sortBy: string | null, sortDirection: SortDirection | null) => {
			setSortBy(sortBy);
			setSortDirection(sortDirection);
		},
		[],
	);

	//	Add page and perPage to the query key and function
	const paginatedQueryKey = useMemo(
		() => [...queryKey, sortBy, sortDirection],
		[queryKey, sortBy, sortDirection],
	);
	const paginatedQueryFn = useCallback<OffsetPaginatedQueryProviderProps<T>['queryFn']>(
		(page, perPage) => queryFn(page, perPage, sortBy, sortDirection),
		[queryFn, sortBy, sortDirection],
	);

	return (
		<OffsetPaginatedQueryProvider
			defaultData={defaultData}
			queryKey={paginatedQueryKey}
			queryFn={paginatedQueryFn}
			syncWithSearchParams={syncWithSearchParams}
			sortBy={sortBy}
			setSortBy={setSortBy}
			sortDirection={sortDirection}
			setSortDirection={setSortDirection}
			setSort={handleSetSort}
			{...props}
		/>
	);
};
