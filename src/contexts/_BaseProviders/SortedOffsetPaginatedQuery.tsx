import { Context, PropsWithChildren, useMemo, useState } from 'react';

import {
	SortDirection,
	SortedOffsetPaginatedContextState,
	SortedOffsetPaginatedProviderProps,
} from '@/types';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export interface SortedOffsetPaginatedQueryProviderProps<
	T extends SortedOffsetPaginatedContextState<unknown>,
> extends SortedOffsetPaginatedProviderProps,
		PropsWithChildren,
		Record<string, unknown> {
	context: Context<T>;
	defaultData: T;
	queryKey: string[];
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
	defaultPage,
	defaultPerPage,
	defaultSortBy,
	defaultSortDirection,
	context,
	defaultData,
	queryKey,
	queryFn,
	children,
	...props
}: SortedOffsetPaginatedQueryProviderProps<T>) => {
	const [page, setPage] = useState(defaultPage || defaultData.page);
	const [perPage, setPerPage] = useState(defaultPerPage || defaultData.perPage);
	const [sortBy, setSortBy] = useState(defaultSortBy || defaultData.sortBy);
	const [sortDirection, setSortDirection] = useState(
		defaultSortDirection || defaultData.sortDirection,
	);

	//	Add page and perPage to the query key and function
	const paginatedQueryKey = useMemo(
		() => [...queryKey, sortBy, sortDirection, perPage, page],
		[queryKey, sortBy, sortDirection, perPage, page],
	);
	const paginatedQueryFn = useMemo(
		() => queryFn(page, perPage, sortBy, sortDirection),
		[queryFn, perPage, page, sortBy, sortDirection],
	);

	const queryResults = useQuery({
		queryKey: paginatedQueryKey,
		queryFn: paginatedQueryFn,
		placeholderData: keepPreviousData,
	});

	return (
		<context.Provider
			value={
				{
					page,
					setPage,

					perPage,
					setPerPage,

					sortBy,
					setSortBy,

					sortDirection,
					setSortDirection,

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
