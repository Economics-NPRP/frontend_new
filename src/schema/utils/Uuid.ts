import { InferOutput, nonEmpty, pipe, string, uuid } from 'valibot';

export const UuidSchema = () => pipe(string(), nonEmpty(), uuid());

export type Uuid = InferOutput<ReturnType<typeof UuidSchema>>;
