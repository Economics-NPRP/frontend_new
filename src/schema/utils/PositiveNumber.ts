import { getTranslations } from 'next-intl/server';
import { InferOutput, integer, minValue, number, pipe } from 'valibot';

const t = await getTranslations();

export const PositiveNumberSchema = (key: string) =>
	pipe(
		number(({ received }) => t('model.PositiveNumber.number', { key, received })),
		integer(({ received }) => t('model.PositiveNumber.integer', { key, received })),
		minValue(0, ({ received }) => t('model.PositiveNumber.positive', { key, received })),
	);

export type AuctionType = InferOutput<ReturnType<typeof PositiveNumberSchema>>;
