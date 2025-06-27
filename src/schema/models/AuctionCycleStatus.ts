import { InferOutput, nonEmpty, picklist, pipe } from 'valibot';

export const AuctionCycleStatusSchema = pipe(
	picklist(['draft', 'approved', 'ongoing', 'ended']),
	nonEmpty(),
);

export type AuctionCycleStatus = InferOutput<typeof AuctionCycleStatusSchema>;
