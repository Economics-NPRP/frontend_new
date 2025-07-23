import { InferOutput, nonEmpty, picklist, pipe } from 'valibot';

export const AuctionStatusSchema = pipe(picklist(['ongoing', 'upcoming', 'ended']), nonEmpty());
export const AuctionStatusFilterSchema = pipe(
	picklist(['all', 'ongoing', 'upcoming', 'ended']),
	nonEmpty(),
);

export type AuctionStatus = InferOutput<typeof AuctionStatusSchema>;
export type AuctionStatusFilter = InferOutput<typeof AuctionStatusFilterSchema>;
