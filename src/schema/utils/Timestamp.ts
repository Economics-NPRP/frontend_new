import { InferOutput, isoTimestamp, notValue, pipe, string } from 'valibot';

export const TimestampSchema = () =>
	pipe(string(), isoTimestamp(), notValue('1970-01-01T00:00:00.000Z'));

export type Timestamp = InferOutput<ReturnType<typeof TimestampSchema>>;
