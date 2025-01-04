import { getTranslations } from 'next-intl/server';
import { InferOutput, nonEmpty, picklist, pipe } from 'valibot';

const t = await getTranslations();

export const AuctionTypeSchema = pipe(
	picklist(['open', 'sealed'], ({ received }) => t('model.AuctionType.picklist', { received })),
	nonEmpty(() => t('model.AuctionType.required')),
);

export type AuctionType = InferOutput<typeof AuctionTypeSchema>;
