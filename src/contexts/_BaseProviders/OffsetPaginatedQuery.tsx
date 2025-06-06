import { Context, PropsWithChildren, useMemo, useState } from 'react';

import { OffsetPaginatedContextState, OffsetPaginatedProviderProps } from '@/types';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export interface OffsetPaginatedQueryProviderProps<T extends OffsetPaginatedContextState<unknown>>
	extends OffsetPaginatedProviderProps,
		PropsWithChildren,
		Record<string, unknown> {
	context: Context<T>;
	defaultData: T;
	queryKey: string[];
	queryFn: (page: number, perPage: number) => () => Promise<unknown>;
}
export const OffsetPaginatedQueryProvider = <T extends OffsetPaginatedContextState<unknown>>({
	defaultPage,
	defaultPerPage,
	context,
	defaultData,
	queryKey,
	queryFn,
	children,
	...props
}: OffsetPaginatedQueryProviderProps<T>) => {
	const [page, setPage] = useState(defaultPage || defaultData.page);
	const [perPage, setPerPage] = useState(defaultPerPage || defaultData.perPage);

	//	Add page and perPage to the query key and function
	const paginatedQueryKey = useMemo(
		() => [...queryKey, perPage, page],
		[queryKey, perPage, page],
	);
	const paginatedQueryFn = useMemo(() => queryFn(page, perPage), [queryFn, perPage, page]);

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
