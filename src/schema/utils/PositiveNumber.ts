import { getTranslations } from 'next-intl/server';
import { InferOutput, integer, minValue, nullish, number, pipe } from 'valibot';

const t = await getTranslations();

const BaseSchema = (key: string) =>
	pipe(
		number(({ received }) => t('model.PositiveNumber.number', { key, received })),
		integer(({ received }) => t('model.PositiveNumber.integer', { key, received })),
		minValue(0, ({ received }) => t('model.PositiveNumber.positive', { key, received })),
	);
export const PositiveNumberSchema = (key: string, fallback?: boolean) =>
	fallback ? nullish(BaseSchema(key), 0) : BaseSchema(key);

export type PositiveNumber = InferOutput<ReturnType<typeof PositiveNumberSchema>>;
