import { InferOutput, nonEmpty, picklist, pipe } from 'valibot';

export const AuctionJoinedStatusSchema = pipe(picklist(['joined', 'notJoined']), nonEmpty());
export const AuctionJoinedStatusFilterSchema = pipe(
	picklist(['all', 'joined', 'notJoined']),
	nonEmpty(),
);

export type AuctionJoinedStatus = InferOutput<typeof AuctionJoinedStatusSchema>;
export type AuctionJoinedStatusFilter = InferOutput<typeof AuctionJoinedStatusFilterSchema>;
