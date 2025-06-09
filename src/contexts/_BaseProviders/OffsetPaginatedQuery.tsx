'use client';

import { useMemo, useState } from 'react';

import { QueryProvider, QueryProviderProps } from '@/contexts';
import { OffsetPaginatedContextState, OffsetPaginatedProviderProps } from '@/types';

export interface OffsetPaginatedQueryProviderProps<T extends OffsetPaginatedContextState<unknown>>
	extends OffsetPaginatedProviderProps,
		Pick<QueryProviderProps<T>, 'context' | 'defaultData' | 'queryKey' | 'disabled'>,
		Record<string, unknown> {
	queryFn: (page: number, perPage: number) => () => Promise<unknown>;
}
export const OffsetPaginatedQueryProvider = <T extends OffsetPaginatedContextState<unknown>>({
	defaultPage,
	defaultPerPage,
	context,
	defaultData,
	queryKey,
	queryFn,
	disabled,
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
	const paginatedQueryFn = useMemo(() => () => queryFn(page, perPage), [queryFn, perPage, page]);

	return (
		<QueryProvider
			context={context}
			defaultData={defaultData}
			queryKey={paginatedQueryKey}
			queryFn={paginatedQueryFn}
			disabled={disabled}
			children={children}
			page={page}
			setPage={setPage}
			perPage={perPage}
			setPerPage={setPerPage}
			{...props}
		/>
	);
};
