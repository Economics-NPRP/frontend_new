import { Dispatch, SetStateAction, createContext } from 'react';

import { AuctionType, IAuctionData } from '@/schema/models';
import { AuctionCategory, OffsetPaginatedData, SortDirection } from '@/types';
import { RangeSliderValue } from '@mantine/core';
import { DatesRangeValue } from '@mantine/dates';

export const DEFAULT_CONTEXT: ICatalogueContext = {
	page: 1,
	perPage: 12,
	pageCount: 1,

	sortBy: 'created_at',
	sortDirection: 'desc',

	filters: {
		type: [],
		status: [],
		sector: [],
		owner: [],
	},

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

	setFilters: () => {},
	removeFilter: () => {},
};

export interface IAuctionFilters {
	type?: Array<AuctionType>;
	status?: Array<'ongoing' | 'ending' | 'starting' | 'upcoming' | 'ended'>;
	sector?: Array<AuctionCategory>;
	owner?: Array<string>;
	date?: DatesRangeValue;
	permits?: RangeSliderValue;
	minBid?: RangeSliderValue;
	price?: RangeSliderValue;
}

export interface ICatalogueContext {
	page: number;
	perPage: number;
	pageCount: number;

	sortBy: string;
	sortDirection: SortDirection;

	filters: IAuctionFilters;

	auctionData: OffsetPaginatedData<IAuctionData>;
	isLoading: boolean;
	isError: boolean;
	isSuccess: boolean;

	setPage: Dispatch<SetStateAction<number>>;
	setPerPage: Dispatch<SetStateAction<number>>;
	setPageCount: Dispatch<SetStateAction<number>>;

	setSortBy: Dispatch<SetStateAction<string>>;
	setSortDirection: Dispatch<SetStateAction<SortDirection>>;

	setFilters: Dispatch<SetStateAction<IAuctionFilters>>;
	removeFilter: <T extends keyof IAuctionFilters>(
		key: T,
		value?: T extends keyof Pick<IAuctionFilters, 'type' | 'status' | 'sector' | 'owner'>
			? IAuctionFilters[T] extends Array<infer U> | undefined
				? U
				: never
			: never,
	) => void;
}

export const CatalogueContext = createContext<ICatalogueContext>(DEFAULT_CONTEXT);
