import { getTranslations } from 'next-intl/server';
import { InferOutput, nonEmpty, picklist, pipe } from 'valibot';

const t = await getTranslations();

export const UserTypeSchema = pipe(
	picklist(['firm', 'admin'], ({ received }) => t('model.UserType.picklist', { received })),
	nonEmpty(() => t('model.UserType.required')),
);

export type UserType = InferOutput<typeof UserTypeSchema>;
