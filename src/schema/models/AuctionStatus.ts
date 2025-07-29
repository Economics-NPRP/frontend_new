import { InferOutput, nonEmpty, picklist, pipe } from 'valibot';

export const AuctionStatusList = ['ongoing', 'upcoming', 'ended'] as const;
export const AuctionStatusListFilter = ['all', 'ongoing', 'upcoming', 'ended'] as const;

export const AuctionStatusSchema = pipe(picklist(AuctionStatusList), nonEmpty());
export const AuctionStatusFilterSchema = pipe(picklist(AuctionStatusListFilter), nonEmpty());

export type AuctionStatus = InferOutput<typeof AuctionStatusSchema>;
export type AuctionStatusFilter = InferOutput<typeof AuctionStatusFilterSchema>;
