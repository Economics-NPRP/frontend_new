import { InferOutput, boolean, number, object, optional, string } from 'valibot';

import { AuctionStatusFilterSchema } from './AuctionStatus';
import { AuctionTypeFilterSchema } from './AuctionType';
import { SectorListFilterSchema } from './SectorData';

export const FirmQueryFiltersDataSchema = object({
	firmId: optional(string()),
	sector: optional(SectorListFilterSchema),
	auctionType: optional(AuctionTypeFilterSchema),
	auctionStatus: optional(AuctionStatusFilterSchema),
	isPrimaryMarket: optional(boolean()),
	startDatetimeFrom: optional(string()),
	startDatetimeTo: optional(string()),
	endDatetimeFrom: optional(string()),
	endDatetimeTo: optional(string()),
	minPermits: optional(number()),
	maxPermits: optional(number()),
	ownerId: optional(string()),
	auctionId: optional(string()),
});

export type FirmQueryFiltersData = InferOutput<typeof FirmQueryFiltersDataSchema>;

export const DefaultFirmQueryFiltersData: FirmQueryFiltersData = {
	firmId: '',
	sector: [],
	auctionType: 'all',
	auctionStatus: 'all',
	isPrimaryMarket: false,
	startDatetimeFrom: '',
	startDatetimeTo: '',
	endDatetimeFrom: '',
	endDatetimeTo: '',
	minPermits: 0,
	maxPermits: 1000000,
	ownerId: '',
	auctionId: '',
};