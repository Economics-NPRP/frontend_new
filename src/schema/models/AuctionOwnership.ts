import { InferOutput, nonEmpty, picklist, pipe } from 'valibot';

export const AuctionOwnershipSchema = pipe(picklist(['government', 'private']), nonEmpty());
export const AuctionOwnershipFilterSchema = pipe(
	picklist(['all', 'government', 'private']),
	nonEmpty(),
);

export type AuctionOwnership = InferOutput<typeof AuctionOwnershipSchema>;
export type AuctionOwnershipFilter = InferOutput<typeof AuctionOwnershipFilterSchema>;
