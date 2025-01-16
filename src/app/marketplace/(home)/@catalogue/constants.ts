import { createContext } from 'react';

import { IAuctionData } from '@/schema/models';
import { OffsetPaginatedData, SortDirection } from '@/types';

export const DEFAULT_CONTEXT: ICatalogueContext = {
	page: 1,
	perPage: 12,
	pageCount: 1,

	sortBy: 'created_at',
	sortDirection: 'desc',

	auctionData: {
		ok: false,
		results: [],
		page: 1,
		pageCount: 1,
		totalCount: 0,
		perPage: 12,
		resultCount: 0,
	},
	isLoading: true,
	isError: false,
	isSuccess: false,

	setPage: () => {},
	setPerPage: () => {},
	setPageCount: () => {},

	setSortBy: () => {},
	setSortDirection: () => {},
};

interface ICatalogueContext {
	page: number;
	perPage: number;
	pageCount: number;

	sortBy: string;
	sortDirection: SortDirection;

	// filters: Array<string>;

	auctionData: OffsetPaginatedData<IAuctionData>;
	isLoading: boolean;
	isError: boolean;
	isSuccess: boolean;

	setPage: (page: number) => void;
	setPerPage: (perPage: number) => void;
	setPageCount: (pageCount: number) => void;

	setSortBy: (sortBy: string) => void;
	setSortDirection: (sortDirection: SortDirection) => void;
}
export const CatalogueContext = createContext<ICatalogueContext>(DEFAULT_CONTEXT);
