'use client';

import { useMemo, useState } from 'react';

import { QueryProvider, QueryProviderProps } from '@/contexts';
import { KeysetPaginatedContextState, KeysetPaginatedProviderProps } from '@/types';

export interface KeysetPaginatedQueryProviderProps<T extends KeysetPaginatedContextState<unknown>>
	extends KeysetPaginatedProviderProps,
		Pick<QueryProviderProps<T>, 'context' | 'defaultData' | 'queryKey' | 'disabled'>,
		Record<string, unknown> {
	queryFn: (cursor: string | null, perPage: number) => () => Promise<unknown>;
}
export const KeysetPaginatedQueryProvider = <T extends KeysetPaginatedContextState<unknown>>({
	defaultCursor,
	defaultPerPage,
	context,
	defaultData,
	queryKey,
	queryFn,
	disabled,
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
	const paginatedQueryFn = useMemo(
		() => () => queryFn(cursor, perPage),
		[queryFn, perPage, cursor],
	);

	return (
		<QueryProvider
			context={context}
			defaultData={defaultData}
			queryKey={paginatedQueryKey}
			queryFn={paginatedQueryFn}
			disabled={disabled}
			children={children}
			cursor={cursor}
			setCursor={setCursor}
			perPage={perPage}
			setPerPage={setPerPage}
			{...props}
		/>
	);
};
