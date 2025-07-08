import { InferOutput, array, maxLength, minLength, nonEmpty, picklist, pipe } from 'valibot';

import { SectorList } from '@/constants/SectorData';

export const SectorTypeSchema = pipe(picklist(SectorList), nonEmpty());

export const SectorListSchema = pipe(
	array(picklist(SectorList)),
	nonEmpty(),
	minLength(1),
	maxLength(6),
);

export type SectorType = InferOutput<typeof SectorTypeSchema>;
