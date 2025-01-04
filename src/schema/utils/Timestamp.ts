import { DateTime } from 'luxon';
import { getTranslations } from 'next-intl/server';
import { InferOutput, isoTimestamp, pipe, string, transform } from 'valibot';

const t = await getTranslations();

export const TimestampSchema = (key: string) =>
	pipe(
		string(({ received }) => t(`model.Timestamp.string`, { key, received })),
		isoTimestamp(({ received }) => t(`model.Timestamp.isoTimestamp`, { key, received })),
		transform((value) => DateTime.fromISO(value)),
	);

export type AuctionType = InferOutput<ReturnType<typeof TimestampSchema>>;
