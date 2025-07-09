import { InferOutput, nonEmpty, picklist, pipe } from 'valibot';

import { EnergySubsectorList, IndustrySubsectorList } from '@/constants/SubsectorData';

export const EnergySubsectorTypeSchema = pipe(picklist(EnergySubsectorList), nonEmpty());
export const IndustrySubsectorTypeSchema = pipe(picklist(IndustrySubsectorList), nonEmpty());

export const SubsectorTypeSchema = pipe(
	picklist([...EnergySubsectorList, ...IndustrySubsectorList]),
	nonEmpty(),
);

export type EnergySubsectorType = InferOutput<typeof EnergySubsectorTypeSchema>;
export type IndustrySubsectorType = InferOutput<typeof IndustrySubsectorTypeSchema>;

export type SubsectorType = EnergySubsectorType | IndustrySubsectorType;
