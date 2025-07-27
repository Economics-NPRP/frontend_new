'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { OffsetPaginatedQueryProvider, OffsetPaginatedQueryProviderProps } from '@/contexts';
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
			'context' | 'defaultData' | 'queryKey' | 'syncWithSearchParams' | 'id' | 'disabled'
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
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const [searchParamsState, setSearchParamsState] = useState(searchParams.toString() || '');
	const [sortBy, setSortBy] = useState(defaultSortBy || defaultData.sortBy);
	const [sortDirection, setSortDirection] = useState(
		defaultSortDirection || defaultData.sortDirection,
	);

	//	Update sortBy and sortDirection from search params
	useEffect(() => {
		if (!syncWithSearchParams) return;

		const parsedSearchParams = new URLSearchParams(searchParamsState);

		const newSortBy = parsedSearchParams.get('sortBy') || defaultSortBy || defaultData.sortBy;
		const newSortDirection =
			(parsedSearchParams.get('sortDirection') as SortDirection | null) ||
			defaultSortDirection ||
			defaultData.sortDirection;

		const hasSortByChanged = newSortBy && newSortBy !== sortBy;
		const hasSortDirectionChanged = newSortDirection && newSortDirection !== sortDirection;
		const hasSearchParamsChanged = searchParamsState !== searchParams.toString();

		if (hasSortByChanged) setSortBy(newSortBy);
		if (hasSortDirectionChanged) setSortDirection(newSortDirection);
		if (hasSearchParamsChanged && (hasSortByChanged || hasSortDirectionChanged))
			router.replace(`${pathname}?${searchParamsState.toString()}`, {
				scroll: false,
			});
	}, [syncWithSearchParams, searchParams, searchParamsState]);

	const handleSetSortBy = useCallback(
		(sortBy: string | null) => {
			if (!syncWithSearchParams) return setSortBy(sortBy);

			const params = new URL(document.URL).searchParams;

			if (sortBy && sortBy !== (defaultSortBy || defaultData.sortBy))
				params.set('sortBy', sortBy);
			else params.delete('sortBy');

			setSearchParamsState(params.toString());
		},
		[syncWithSearchParams, pathname, router],
	);

	const handleSetSortDirection = useCallback(
		(sortDirection: SortDirection | null) => {
			if (!syncWithSearchParams) return setSortDirection(sortDirection);

			const params = new URL(document.URL).searchParams;

			if (
				sortDirection &&
				sortDirection !== (defaultSortDirection || defaultData.sortDirection)
			)
				params.set('sortDirection', sortDirection);
			else params.delete('sortDirection');

			setSearchParamsState(params.toString());
		},
		[syncWithSearchParams, pathname, router],
	);

	const handleSetSort = useCallback(
		(sortBy: string | null, sortDirection: SortDirection | null) => {
			if (!syncWithSearchParams) {
				setSortBy(sortBy);
				setSortDirection(sortDirection);
				return;
			}

			const params = new URL(document.URL).searchParams;

			if (sortBy && sortBy !== (defaultSortBy || defaultData.sortBy))
				params.set('sortBy', sortBy);
			else params.delete('sortBy');

			if (
				sortDirection &&
				sortDirection !== (defaultSortDirection || defaultData.sortDirection)
			)
				params.set('sortDirection', sortDirection);
			else params.delete('sortDirection');

			setSearchParamsState(params.toString());
		},
		[syncWithSearchParams, pathname, router],
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
			setSortBy={handleSetSortBy}
			sortDirection={sortDirection}
			setSortDirection={handleSetSortDirection}
			setSort={handleSetSort}
			{...props}
		/>
	);
};
