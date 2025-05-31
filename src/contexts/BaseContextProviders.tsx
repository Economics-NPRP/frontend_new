'use client';

import { Context, PropsWithChildren, useMemo, useState } from 'react';

import {
	ContextState,
	KeysetPaginatedContextState,
	KeysetPaginatedProviderProps,
	OffsetPaginatedContextState,
	OffsetPaginatedProviderProps,
} from '@/types';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

export interface BaseQueryContextProviderProps<T extends ContextState<unknown>>
	extends PropsWithChildren,
		Record<string, unknown> {
	context: Context<T>;
	defaultData: T;
	queryKey: string[];
	queryFn: () => Promise<unknown>;
}
export const BaseQueryContextProvider = <T extends ContextState<unknown>>({
	context,
	defaultData,
	queryKey,
	queryFn,
	children,
	...props
}: BaseQueryContextProviderProps<T>) => {
	const queryResults = useQuery({
		queryKey,
		queryFn,
		placeholderData: keepPreviousData,
	});

	return (
		<context.Provider
			value={
				{
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

export interface BaseOffsetPaginatedQueryContextProviderProps<
	T extends OffsetPaginatedContextState<unknown>,
> extends OffsetPaginatedProviderProps,
		PropsWithChildren,
		Record<string, unknown> {
	context: Context<T>;
	defaultData: T;
	queryKey: string[];
	queryFn: (page: number, perPage: number) => () => Promise<unknown>;
}
export const BaseOffsetPaginatedQueryContextProvider = <
	T extends OffsetPaginatedContextState<unknown>,
>({
	defaultPage,
	defaultPerPage,
	context,
	defaultData,
	queryKey,
	queryFn,
	children,
	...props
}: BaseOffsetPaginatedQueryContextProviderProps<T>) => {
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

export interface BaseKeysetPaginatedQueryContextProviderProps<
	T extends KeysetPaginatedContextState<unknown>,
> extends KeysetPaginatedProviderProps,
		PropsWithChildren,
		Record<string, unknown> {
	context: Context<T>;
	defaultData: T;
	queryKey: string[];
	queryFn: (cursor: string | null, perPage: number) => () => Promise<unknown>;
}
export const BaseKeysetPaginatedQueryContextProvider = <
	T extends KeysetPaginatedContextState<unknown>,
>({
	defaultCursor,
	defaultPerPage,
	context,
	defaultData,
	queryKey,
	queryFn,
	children,
	...props
}: BaseKeysetPaginatedQueryContextProviderProps<T>) => {
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
