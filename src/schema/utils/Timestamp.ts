import { InferOutput, isoTimestamp, pipe, string } from 'valibot';

export const TimestampSchema = () => pipe(string(), isoTimestamp());

export type Timestamp = InferOutput<ReturnType<typeof TimestampSchema>>;
