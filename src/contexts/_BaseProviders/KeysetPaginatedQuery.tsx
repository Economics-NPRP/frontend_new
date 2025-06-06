import { Context, PropsWithChildren, useMemo, useState } from 'react';

import { KeysetPaginatedContextState, KeysetPaginatedProviderProps } from '@/types';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export interface KeysetPaginatedQueryProviderProps<T extends KeysetPaginatedContextState<unknown>>
	extends KeysetPaginatedProviderProps,
		PropsWithChildren,
		Record<string, unknown> {
	context: Context<T>;
	defaultData: T;
	queryKey: string[];
	queryFn: (cursor: string | null, perPage: number) => () => Promise<unknown>;
}
export const KeysetPaginatedQueryProvider = <T extends KeysetPaginatedContextState<unknown>>({
	defaultCursor,
	defaultPerPage,
	context,
	defaultData,
	queryKey,
	queryFn,
	children,
	...props
}: KeysetPaginatedQueryProviderProps<T>) => {
	const [cursor, setCursor] = useState(defaultCursor || defaultData.cursor);
	const [perPage, setPerPage] = useState(defaultPerPage || defaultData.perPage);

	//	Add page and perPage to the query key and function
	const paginatedQueryKey = useMemo(
		() => [...queryKey, perPage, cursor],
		[queryKey, perPage, cursor],
	);
	const paginatedQueryFn = useMemo(() => queryFn(cursor, perPage), [queryFn, perPage, cursor]);

	const queryResults = useQuery({
		queryKey: paginatedQueryKey,
		queryFn: paginatedQueryFn,
		placeholderData: keepPreviousData,
	});

	return (
		<context.Provider
			value={
				{
					cursor,
					setCursor,

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
