import { InferOutput, nonEmpty, picklist, pipe } from 'valibot';

export const AuctionApplicationStatusList = ['pending', 'approved', 'rejected', 'executed'] as const;
export const AuctionApplicationStatusListFilter = ['all', 'pending', 'approved', 'rejected', 'executed'] as const;

export const AuctionApplicationStatusSchema = pipe(picklist(AuctionApplicationStatusList), nonEmpty());
export const AuctionApplicationStatusFilterSchema = pipe(
  picklist(AuctionApplicationStatusListFilter),
  nonEmpty(),
);

export type AuctionApplicationStatus = InferOutput<typeof AuctionApplicationStatusSchema>;
export type AuctionApplicationStatusFilter = InferOutput<typeof AuctionApplicationStatusFilterSchema>;
