import { PropsWithChildren } from 'react';

import { SortDirection } from '@/types';
import {
	ArrayServerData,
	KeysetPaginatedData,
	OffsetPaginatedData,
	ServerData,
} from '@/types/ServerData';
import { InfiniteData } from '@tanstack/react-query';

export interface OffsetPaginatedProviderProps extends PropsWithChildren {
	defaultPage?: number;
	defaultPerPage?: number;
}

export interface KeysetPaginatedProviderProps extends PropsWithChildren {
	defaultCursor?: string | null;
	defaultPerPage?: number;
}

export interface SortedOffsetPaginatedProviderProps extends PropsWithChildren {
	defaultPage?: number;
	defaultPerPage?: number;
	defaultSortBy?: string | null;
	defaultSortDirection?: SortDirection | null;
}

export interface ContextState<T> {
	data: T;
	error: Error | null;
	isLoading: boolean;
	isFetching: boolean;
	isError: boolean;
	isSuccess: boolean;
}

export interface ArrayContextState<T> extends ContextState<ArrayServerData<T>> {}

export interface InfiniteContextState<T>
	extends Pick<ContextState<T>, 'error' | 'isLoading' | 'isFetching' | 'isError' | 'isSuccess'> {
	data: InfiniteData<T>;
	isFetchingNextPage: boolean;
	hasNextPage: boolean;
	fetchNextPage: () => void;
}

export interface ServerContextState<T> extends ContextState<ServerData<T>> {}

interface OffsetContextStateCore {
	page: number;
	setPage: (page: number) => void;

	perPage: number;
	setPerPage: (perPage: number) => void;
}
export interface OffsetPaginatedContextState<T>
	extends ContextState<OffsetPaginatedData<T>>,
		OffsetContextStateCore {}
export interface OffsetPaginatedInfiniteContextState<T>
	extends InfiniteContextState<OffsetPaginatedData<T>>,
		Pick<OffsetContextStateCore, 'perPage' | 'setPerPage'> {}

export interface KeysetContextStateCore {
	cursor: string | null;
	setCursor: (cursor: string | null) => void;

	perPage: number;
	setPerPage: (perPage: number) => void;
}
export interface KeysetPaginatedContextState<T>
	extends ContextState<KeysetPaginatedData<T>>,
		KeysetContextStateCore {}
export interface KeysetPaginatedInfiniteContextState<T>
	extends InfiniteContextState<KeysetPaginatedData<T>>,
		KeysetContextStateCore {}

export interface SortedOffsetContextStateCore {
	sortBy: string | null;
	setSortBy: (sortBy: string) => void;

	sortDirection: SortDirection | null;
	setSortDirection: (sortDirection: SortDirection) => void;
}
export interface SortedOffsetPaginatedContextState<T>
	extends OffsetPaginatedContextState<T>,
		SortedOffsetContextStateCore {}
export interface SortedOffsetPaginatedInfiniteContextState<T>
	extends OffsetPaginatedInfiniteContextState<T>,
		SortedOffsetContextStateCore {}

export const getDefaultContextState = <T>(defaultData?: T): ServerContextState<T> => ({
	data: {
		ok: false,
		errors: [],
		...defaultData,
	} as ServerData<T>,
	error: null,
	isLoading: true,
	isFetching: true,
	isError: false,
	isSuccess: false,
});

export const getDefaultArrayContextState = <T>(defaultData?: Array<T>): ArrayContextState<T> => ({
	data: {
		ok: false,
		errors: [],
		results: defaultData || [],
		resultCount: 0,
	} as ArrayServerData<T>,
	error: null,
	isLoading: true,
	isFetching: true,
	isError: false,
	isSuccess: false,
});

const getInfiniteContextState = <T>(): InfiniteContextState<T> => ({
	data: {
		pages: [],
		pageParams: [],
	},
	error: null,
	isLoading: true,
	isFetching: true,
	isError: false,
	isSuccess: false,
	isFetchingNextPage: false,
	hasNextPage: false,
	fetchNextPage: () => {},
});

export const getDefaultOffsetPaginatedContextState = <T>(
	defaultPage: number = 1,
	defaultPerPage: number = 10,
	defaultData?: T,
): OffsetPaginatedContextState<T> => ({
	page: defaultPage,
	setPage: () => {},

	perPage: defaultPerPage,
	setPerPage: () => {},

	...getDefaultContextState({
		results: [],
		page: defaultPage,
		pageCount: 1,
		totalCount: 0,
		perPage: defaultPerPage,
		resultCount: 0,

		...defaultData,
	}),
});

export const getDefaultSortedOffsetPaginatedContextState = <T>(
	defaultPage: number = 1,
	defaultPerPage: number = 10,
	defaultSortBy: string | null = null,
	defaultSortDirection: SortDirection | null = null,
	defaultData?: T,
): SortedOffsetPaginatedContextState<T> => ({
	sortBy: defaultSortBy,
	setSortBy: () => {},

	sortDirection: defaultSortDirection,
	setSortDirection: () => {},

	...getDefaultOffsetPaginatedContextState(defaultPage, defaultPerPage, defaultData),
});

export const getDefaultOffsetPaginatedInfiniteContextState = <T>(
	defaultPage: number = 1,
	defaultPerPage: number = 10,
	defaultData?: T,
): OffsetPaginatedInfiniteContextState<T> => ({
	...getDefaultOffsetPaginatedContextState(defaultPage, defaultPerPage, defaultData),
	...getInfiniteContextState<OffsetPaginatedData<T>>(),
});
export const getDefaultSortedOffsetPaginatedInfiniteContextState = <T>(
	defaultPage: number = 1,
	defaultPerPage: number = 10,
	defaultSortBy: string | null = null,
	defaultSortDirection: SortDirection | null = null,
	defaultData?: T,
): SortedOffsetPaginatedInfiniteContextState<T> => ({
	...getDefaultSortedOffsetPaginatedContextState(
		defaultPage,
		defaultPerPage,
		defaultSortBy,
		defaultSortDirection,
		defaultData,
	),
	...getInfiniteContextState<OffsetPaginatedData<T>>(),
});

export const getDefaultKeysetPaginatedContextState = <T>(
	defaultCursor: string | null = null,
	defaultPerPage: number = 10,
	defaultData?: T,
): KeysetPaginatedContextState<T> => ({
	cursor: defaultCursor,
	setCursor: () => {},

	perPage: defaultPerPage,
	setPerPage: () => {},

	...getDefaultContextState({
		results: [],
		perPage: defaultPerPage,
		hasNext: false,
		hasPrev: false,
		cursorForNextPage: null,
		cursorForPrevPage: null,
		totalCount: 0,
		isExact: true,
		resultCount: 0,

		...defaultData,
	}),
});
