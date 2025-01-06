import { getTranslations } from 'next-intl/server';
import { InferOutput, isoTimestamp, pipe, string } from 'valibot';

const t = await getTranslations();

export const TimestampSchema = (key: string) =>
	pipe(
		string(({ received }) => t(`model.Timestamp.string`, { key, received })),
		isoTimestamp(({ received }) => t(`model.Timestamp.isoTimestamp`, { key, received })),
	);

export type Timestamp = InferOutput<ReturnType<typeof TimestampSchema>>;
