import { InferOutput, nonEmpty, picklist, pipe } from 'valibot';

import {
	AgricultureSubsectorList,
	BuildingsSubsectorList,
	EnergySubsectorList,
	IndustrySubsectorList,
	TransportSubsectorList,
	WasteSubsectorList,
} from '@/constants/SubsectorData';

export const EnergySubsectorTypeSchema = pipe(picklist(EnergySubsectorList), nonEmpty());
export const IndustrySubsectorTypeSchema = pipe(picklist(IndustrySubsectorList), nonEmpty());
export const TransportSubsectorTypeSchema = pipe(picklist(TransportSubsectorList), nonEmpty());
export const BuildingsSubsectorTypeSchema = pipe(picklist(BuildingsSubsectorList), nonEmpty());
export const AgricultureSubsectorTypeSchema = pipe(picklist(AgricultureSubsectorList), nonEmpty());
export const WasteSubsectorTypeSchema = pipe(picklist(WasteSubsectorList), nonEmpty());

export const SubsectorTypeSchema = pipe(
	picklist([
		...EnergySubsectorList,
		...IndustrySubsectorList,
		...TransportSubsectorList,
		...BuildingsSubsectorList,
		...AgricultureSubsectorList,
		...WasteSubsectorList,
	]),
	nonEmpty(),
);

export type EnergySubsectorType = InferOutput<typeof EnergySubsectorTypeSchema>;
export type IndustrySubsectorType = InferOutput<typeof IndustrySubsectorTypeSchema>;
export type TransportSubsectorType = InferOutput<typeof TransportSubsectorTypeSchema>;
export type BuildingsSubsectorType = InferOutput<typeof BuildingsSubsectorTypeSchema>;
export type AgricultureSubsectorType = InferOutput<typeof AgricultureSubsectorTypeSchema>;
export type WasteSubsectorType = InferOutput<typeof WasteSubsectorTypeSchema>;

export type SubsectorType = EnergySubsectorType | IndustrySubsectorType;
