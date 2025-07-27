'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { QueryProvider, QueryProviderProps } from '@/contexts';
import { OffsetPaginatedContextState, OffsetPaginatedProviderProps } from '@/types';
import { useLocalStorage } from '@mantine/hooks';

export interface OffsetPaginatedQueryProviderProps<T extends OffsetPaginatedContextState<unknown>>
	extends OffsetPaginatedProviderProps,
		Pick<QueryProviderProps<T>, 'context' | 'defaultData' | 'queryKey' | 'id' | 'disabled'>,
		Record<string, unknown> {
	queryFn: (page: number, perPage: number) => () => Promise<unknown>;
	syncWithSearchParams?: boolean;
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
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const [searchParamsState, setSearchParamsState] = useState(searchParams.toString() || '');
	const [page, setPage] = useState(defaultPage || defaultData.page);
	const [perPage, setPerPage] = useLocalStorage({
		key: `perPage-${id || queryKey.join('-')}`,
		defaultValue: defaultPerPage || defaultData.perPage,
	});

	//	Update page and perPage from search params
	useEffect(() => {
		if (!syncWithSearchParams) return;

		const parsedSearchParams = new URLSearchParams(searchParamsState);

		const newPage = Number(parsedSearchParams.get('page') || defaultPage || defaultData.page);
		const newPerPage = Number(
			parsedSearchParams.get('perPage') || defaultPerPage || defaultData.perPage,
		);

		const hasPageChanged = newPage && newPage !== page;
		const hasPerPageChanged = newPerPage && newPerPage !== perPage;
		const hasSearchParamsChanged = searchParamsState !== searchParams.toString();

		if (hasPageChanged) setPage(newPage);
		if (hasPerPageChanged) setPerPage(newPerPage);
		if (hasSearchParamsChanged && (hasPageChanged || hasPerPageChanged))
			router.replace(`${pathname}?${searchParamsState.toString()}`, {
				scroll: false,
			});
	}, [syncWithSearchParams, searchParams, searchParamsState]);

	const handleSetPage = useCallback(
		(page: number) => {
			if (!syncWithSearchParams) return setPage(page);

			const params = new URL(document.URL).searchParams;

			if (page !== (defaultPage || defaultData.page)) params.set('page', page.toString());
			else params.delete('page');

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

			//	Reset to default page if perPage changes, by deleting page search param
			params.delete('page');

			setSearchParamsState(params.toString());
		},
		[syncWithSearchParams, pathname, router],
	);

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
			setPage={handleSetPage}
			perPage={perPage}
			setPerPage={handleSetPerPage}
			id={id}
			{...props}
		/>
	);
};
