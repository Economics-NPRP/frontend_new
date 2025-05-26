export type ServerData<T> = {
	ok: boolean;
	errors?: Array<string>;
	detail?: string;
} & T;

export type OffsetPaginatedData<T> = ServerData<{
	results: Array<T>;
	perPage: number;
	page: number;
	pageCount: number;
	totalCount: number;
	resultCount: number;
}>;

export type KeysetPaginatedData<T> = ServerData<{
	results: Array<T>;
	perPage: number;
	hasNext: boolean;
	totalCount: number;
	isExact: boolean;
	resultCount: number;
}>;
