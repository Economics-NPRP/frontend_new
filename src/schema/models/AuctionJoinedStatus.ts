import { InferOutput, nonEmpty, picklist, pipe } from 'valibot';

export const AuctionJoinedStatusList = ['joined', 'notJoined'] as const;
export const AuctionJoinedStatusListFilter = ['all', 'joined', 'notJoined'] as const;

export const AuctionJoinedStatusSchema = pipe(picklist(AuctionJoinedStatusList), nonEmpty());
export const AuctionJoinedStatusFilterSchema = pipe(
	picklist(AuctionJoinedStatusListFilter),
	nonEmpty(),
);

export type AuctionJoinedStatus = InferOutput<typeof AuctionJoinedStatusSchema>;
export type AuctionJoinedStatusFilter = InferOutput<typeof AuctionJoinedStatusFilterSchema>;
