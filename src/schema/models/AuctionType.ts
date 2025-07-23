import { InferOutput, nonEmpty, picklist, pipe } from 'valibot';

export const AuctionTypeSchema = pipe(picklist(['open', 'sealed']), nonEmpty());
export const AuctionTypeFilterSchema = pipe(picklist(['all', 'open', 'sealed']), nonEmpty());

export type AuctionType = InferOutput<typeof AuctionTypeSchema>;
export type AuctionTypeFilter = InferOutput<typeof AuctionTypeFilterSchema>;
