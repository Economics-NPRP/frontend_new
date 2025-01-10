import { IGetPaginatedAuctionsOptions } from '@/lib/auctions';

export const QUERY_PARAMS: IGetPaginatedAuctionsOptions = {
	perPage: 12,
	sortBy: 'end_datetime',
	sortDirection: 'asc',
	isLive: true,
} as const;
