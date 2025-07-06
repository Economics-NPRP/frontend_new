import { InferOutput, nonEmpty, picklist, pipe } from 'valibot';

export const SectorTypeSchema = pipe(
	picklist(['energy', 'industry', 'transport', 'buildings', 'agriculture', 'waste']),
	nonEmpty(),
);

export type SectorType = InferOutput<typeof SectorTypeSchema>;
