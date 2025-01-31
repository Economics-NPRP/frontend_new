import { InferOutput, integer, minValue, nullish, number, pipe } from 'valibot';

const BaseSchema = () => pipe(number(), integer(), minValue(0));
export const PositiveNumberSchema = (fallback?: boolean) =>
	fallback ? nullish(BaseSchema(), 0) : BaseSchema();

export type PositiveNumber = InferOutput<ReturnType<typeof PositiveNumberSchema>>;
