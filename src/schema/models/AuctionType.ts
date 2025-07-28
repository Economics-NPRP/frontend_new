import { InferOutput, nonEmpty, picklist, pipe } from 'valibot';

export const AuctionTypeList = ['open', 'sealed'] as const;
export const AuctionTypeListFilter = ['all', 'open', 'sealed'] as const;

export const AuctionTypeSchema = pipe(picklist(AuctionTypeList), nonEmpty());
export const AuctionTypeFilterSchema = pipe(picklist(AuctionTypeListFilter), nonEmpty());

export type AuctionType = InferOutput<typeof AuctionTypeSchema>;
export type AuctionTypeFilter = InferOutput<typeof AuctionTypeFilterSchema>;
