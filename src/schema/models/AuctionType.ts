import { InferOutput, nonEmpty, picklist, pipe } from 'valibot';

export const AuctionTypeSchema = pipe(picklist(['open', 'sealed']), nonEmpty());

export type AuctionType = InferOutput<typeof AuctionTypeSchema>;
