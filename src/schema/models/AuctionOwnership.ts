import { InferOutput, nonEmpty, picklist, pipe } from 'valibot';

export const AuctionOwnershipList = ['government', 'private'] as const;
export const AuctionOwnershipListFilter = ['all', 'government', 'private'] as const;

export const AuctionOwnershipSchema = pipe(picklist(AuctionOwnershipList), nonEmpty());
export const AuctionOwnershipFilterSchema = pipe(picklist(AuctionOwnershipListFilter), nonEmpty());

export type AuctionOwnership = InferOutput<typeof AuctionOwnershipSchema>;
export type AuctionOwnershipFilter = InferOutput<typeof AuctionOwnershipFilterSchema>;
