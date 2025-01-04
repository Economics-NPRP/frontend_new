import { getTranslations } from 'next-intl/server';
import { InferOutput, nonEmpty, pipe, string, uuid } from 'valibot';

const t = await getTranslations();

export const UuidSchema = (key: string) =>
	pipe(
		string(({ received }) => t(`model.Uuid.string`, { key, received })),
		nonEmpty(() => t(`model.Uuid.required`, { key })),
		uuid(({ received }) => t(`model.Uuid.uuid`, { key, received })),
	);

export type Uuid = InferOutput<ReturnType<typeof UuidSchema>>;
