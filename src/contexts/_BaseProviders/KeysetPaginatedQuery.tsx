'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { QueryProvider, QueryProviderProps } from '@/contexts';
import { KeysetPaginatedContextState, KeysetPaginatedProviderProps } from '@/types';
import { useLocalStorage } from '@mantine/hooks';

export interface KeysetPaginatedQueryProviderProps<T extends KeysetPaginatedContextState<unknown>>
	extends KeysetPaginatedProviderProps,
		Pick<QueryProviderProps<T>, 'context' | 'defaultData' | 'queryKey' | 'id' | 'disabled'>,
		Record<string, unknown> {
	queryFn: (cursor: string | null, perPage: number) => () => Promise<unknown>;
	syncWithSearchParams?: boolean;
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
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const [searchParamsState, setSearchParamsState] = useState(searchParams.toString() || '');
	const [cursor, setCursor] = useState(defaultCursor || defaultData.cursor);
	const [perPage, setPerPage] = useLocalStorage({
		key: `perPage-${id || queryKey.join('-')}`,
		defaultValue: defaultPerPage || defaultData.perPage,
	});

	//	Update cursor and perPage from search params
	useEffect(() => {
		if (!syncWithSearchParams) return;

		const parsedSearchParams = new URLSearchParams(searchParamsState);

		const newCursor =
			(parsedSearchParams.get('cursor') as string) || defaultCursor || defaultData.cursor;
		const newPerPage = Number(
			parsedSearchParams.get('perPage') || defaultPerPage || defaultData.perPage,
		);

		const hasCursorChanged = newCursor && newCursor !== cursor;
		const hasPerPageChanged = newPerPage && newPerPage !== perPage;
		const hasSearchParamsChanged = searchParamsState !== searchParams.toString();

		if (hasCursorChanged) setCursor(newCursor);
		if (hasPerPageChanged) setPerPage(newPerPage);
		if (hasSearchParamsChanged && (hasCursorChanged || hasPerPageChanged))
			router.replace(`${pathname}?${searchParamsState.toString()}`, {
				scroll: false,
			});
	}, [syncWithSearchParams, searchParams, searchParamsState]);

	const handleSetCursor = useCallback(
		(cursor: string | null) => {
			if (!syncWithSearchParams) return setCursor(cursor);

			const params = new URL(document.URL).searchParams;

			if (cursor && cursor !== (defaultCursor || defaultData.cursor))
				params.set('cursor', cursor);
			else params.delete('cursor');

			setSearchParamsState(params.toString());
		},
		[syncWithSearchParams, pathname, router],
	);

	const handleSetPerPage = useCallback(
		(perPage: number) => {
			if (!syncWithSearchParams) return setPerPage(perPage);

			const params = new URL(document.URL).searchParams;

			if (perPage !== (defaultPerPage || defaultData.perPage))
				params.set('perPage', perPage.toString());
			else params.delete('perPage');

			//	Reset to default cursor if perPage changes, by deleting cursor search param
			params.delete('cursor');

			setSearchParamsState(params.toString());
		},
		[syncWithSearchParams, pathname, router],
	);

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
			setCursor={handleSetCursor}
			perPage={perPage}
			setPerPage={handleSetPerPage}
			id={id}
			{...props}
		/>
	);
};
