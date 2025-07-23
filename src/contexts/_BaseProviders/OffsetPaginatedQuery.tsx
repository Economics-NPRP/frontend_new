'use client';

import { useMemo, useState } from 'react';

import { QueryProvider, QueryProviderProps } from '@/contexts';
import { OffsetPaginatedContextState, OffsetPaginatedProviderProps } from '@/types';
import { useLocalStorage } from '@mantine/hooks';

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
	id,
	...props
}: OffsetPaginatedQueryProviderProps<T>) => {
	const [page, setPage] = useState(defaultPage || defaultData.page);
	const [perPage, setPerPage] = useLocalStorage({
		key: `perPage-${id || queryKey.join('-')}`,
		defaultValue: defaultPerPage || defaultData.perPage,
	});

	//	Add page and perPage to the query key and function
	const paginatedQueryKey = useMemo(
		() => [...queryKey, perPage, page],
		[queryKey, perPage, page],
	);
	const paginatedQueryFn = useMemo(() => () => queryFn(page, perPage), [queryFn, perPage, page]);

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
