'use client';

import { parseAsInteger } from 'nuqs';
import { useCallback, useMemo } from 'react';

import { QueryProvider, QueryProviderProps } from '@/contexts';
import { useConditionalQueryState } from '@/hooks';
import { OffsetPaginatedContextState, OffsetPaginatedProviderProps } from '@/types';

export interface OffsetPaginatedQueryProviderProps<T extends OffsetPaginatedContextState<unknown>>
	extends OffsetPaginatedProviderProps,
		Pick<QueryProviderProps<T>, 'context' | 'defaultData' | 'queryKey' | 'id' | 'disabled'>,
		Record<string, unknown> {
	queryFn: (page: number, perPage: number) => () => Promise<unknown>;
}
export const OffsetPaginatedQueryProvider = <T extends OffsetPaginatedContextState<unknown>>({
	defaultPage,
	defaultPerPage,
	defaultData,
	queryKey,
	queryFn,
	syncWithSearchParams = false,
	id,
	...props
}: OffsetPaginatedQueryProviderProps<T>) => {
	const [page, setPage] = useConditionalQueryState({
		key: 'page',
		defaultValue: defaultPage || defaultData.page,
		parser: parseAsInteger,
		syncWithSearchParams,
	});
	const [perPage, setPerPage] = useConditionalQueryState({
		key: 'perPage',
		defaultValue: defaultPerPage || defaultData.perPage,
		parser: parseAsInteger,
		syncWithSearchParams,
		saveToLocalStorage: true,
		localStorageKey: `perPage-${id || queryKey.join('-')}`,
		onValueChange: () => setPage(defaultPage || defaultData.page),
	});

	//	Add page and perPage to the query key and function
	const paginatedQueryKey = useMemo(
		() => [...queryKey, perPage, page],
		[queryKey, perPage, page],
	);
	const paginatedQueryFn = useCallback(() => queryFn(page, perPage), [queryFn, perPage, page]);

	return (
		<QueryProvider
			defaultData={defaultData}
			queryKey={paginatedQueryKey}
			queryFn={paginatedQueryFn}
			page={page}
			setPage={setPage}
			perPage={perPage}
			setPerPage={setPerPage}
			id={id}
			{...props}
		/>
	);
};
