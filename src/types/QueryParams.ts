export interface IOffsetPagination {
	page?: number;
	perPage?: number;
}

export interface IKeysetPagination {
	perPage?: number;
	navDirection?: NavDirection;
}

export type SortDirection = 'asc' | 'desc';
export type NavDirection = 'next' | 'prev';
