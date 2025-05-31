import { PropsWithChildren } from 'react';

import { KeysetPaginatedData, OffsetPaginatedData, ServerData } from '@/types/ServerData';

export interface OffsetPaginatedProviderProps extends PropsWithChildren {
	defaultPage?: number;
	defaultPerPage?: number;
}

export interface KeysetPaginatedProviderProps extends PropsWithChildren {
	defaultCursor?: string | null;
	defaultPerPage?: number;
}

export interface ContextState<T> {
	data: T;
	isLoading: boolean;
	isError: boolean;
	isSuccess: boolean;
}

export interface ServerContextState<T> extends ContextState<ServerData<T>> {}

export interface OffsetPaginatedContextState<T> extends ContextState<OffsetPaginatedData<T>> {
	page: number;
	setPage: (page: number) => void;

	perPage: number;
	setPerPage: (perPage: number) => void;
}

export interface KeysetPaginatedContextState<T> extends ContextState<KeysetPaginatedData<T>> {
	cursor: string | null;
	setCursor: (cursor: string | null) => void;

	perPage: number;
	setPerPage: (perPage: number) => void;
}

export const getDefaultContextState = <T>(defaultData: T): ServerContextState<T> => ({
	data: {
		ok: false,
		errors: [],
		...defaultData,
	},
	isLoading: true,
	isError: false,
	isSuccess: false,
});

export const getDefaultOffsetPaginatedContextState = <T>(
	defaultPage: number = 1,
	defaultPerPage: number = 10,
): OffsetPaginatedContextState<T> => ({
	page: defaultPage,
	setPage: () => {},

	perPage: defaultPerPage,
	setPerPage: () => {},

	data: {
		ok: false,
		errors: [],
		results: [],
		page: 1,
		pageCount: 1,
		totalCount: 0,
		perPage: 10,
		resultCount: 0,
	} as OffsetPaginatedData<T>,
	isLoading: true,
	isError: false,
	isSuccess: false,
});

export const getDefaultKeysetPaginatedContextState = <T>(
	defaultCursor: string | null = null,
	defaultPerPage: number = 10,
): KeysetPaginatedContextState<T> => ({
	cursor: defaultCursor,
	setCursor: () => {},

	perPage: defaultPerPage,
	setPerPage: () => {},

	data: {
		ok: false,
		errors: [],
		results: [],
		perPage: 10,
		hasNext: false,
		hasPrev: false,
		cursorForNextPage: null,
		cursorForPrevPage: null,
		totalCount: 0,
		isExact: true,
		resultCount: 0,
	} as KeysetPaginatedData<T>,
	isLoading: true,
	isError: false,
	isSuccess: false,
});
