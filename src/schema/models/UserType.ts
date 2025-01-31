import { InferOutput, nonEmpty, picklist, pipe } from 'valibot';

export const UserTypeSchema = pipe(picklist(['firm', 'admin']), nonEmpty());

export type UserType = InferOutput<typeof UserTypeSchema>;
