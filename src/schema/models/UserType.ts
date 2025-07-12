import { InferOutput, nullish, picklist } from 'valibot';

export const UserTypeSchema = nullish(picklist(['firm', 'admin']));

export type UserType = InferOutput<typeof UserTypeSchema>;
