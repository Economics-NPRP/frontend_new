'use client';

import { ParserBuilder, parseAsInteger, parseAsString } from 'nuqs';
import { useMemo } from 'react';

import { QueryProvider, QueryProviderProps } from '@/contexts';
import { useConditionalQueryState } from '@/hooks';
import { KeysetPaginatedContextState, KeysetPaginatedProviderProps } from '@/types';

export interface KeysetPaginatedQueryProviderProps<T extends KeysetPaginatedContextState<unknown>>
	extends KeysetPaginatedProviderProps,
		Pick<QueryProviderProps<T>, 'context' | 'defaultData' | 'queryKey' | 'id' | 'disabled'>,
		Record<string, unknown> {
	queryFn: (cursor: string | null, perPage: number) => () => Promise<unknown>;
}
export const KeysetPaginatedQueryProvider = <T extends KeysetPaginatedContextState<unknown>>({
	defaultCursor,
	defaultPerPage,
	defaultData,
	queryKey,
	queryFn,
	syncWithSearchParams = false,
	id,
	...props
}: KeysetPaginatedQueryProviderProps<T>) => {
	const [cursor, setCursor] = useConditionalQueryState({
		key: 'cursor',
		defaultValue: defaultCursor || defaultData.cursor,
		parser: parseAsString as ParserBuilder<string | null>,
		syncWithSearchParams,
	});
	const [perPage, setPerPage] = useConditionalQueryState({
		key: 'perPage',
		defaultValue: defaultPerPage || defaultData.perPage,
		parser: parseAsInteger,
		syncWithSearchParams,
		saveToLocalStorage: true,
		localStorageKey: `perPage-${id || queryKey.join('-')}`,
		onValueChange: () => setCursor(defaultCursor || defaultData.cursor),
	});

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
			defaultData={defaultData}
			queryKey={paginatedQueryKey}
			queryFn={paginatedQueryFn}
			cursor={cursor}
			setCursor={setCursor}
			perPage={perPage}
			setPerPage={setPerPage}
			id={id}
			{...props}
		/>
	);
};
