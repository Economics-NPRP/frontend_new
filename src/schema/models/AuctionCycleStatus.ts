import { InferOutput, nonEmpty, picklist, pipe } from 'valibot';

export const AuctionCycleStatusList = ['draft', 'approved', 'ongoing', 'ended'] as const;
export const AuctionCycleStatusListFilter = [
	'all',
	'draft',
	'approved',
	'ongoing',
	'ended',
] as const;

export const AuctionCycleStatusSchema = pipe(picklist(AuctionCycleStatusList), nonEmpty());
export const AuctionCycleStatusFilterSchema = pipe(
	picklist(AuctionCycleStatusListFilter),
	nonEmpty(),
);

export type AuctionCycleStatus = InferOutput<typeof AuctionCycleStatusSchema>;
export type AuctionCycleStatusFilter = InferOutput<typeof AuctionCycleStatusFilterSchema>;
