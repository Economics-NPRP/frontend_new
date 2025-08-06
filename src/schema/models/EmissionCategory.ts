import { InferOutput, nonEmpty, picklist, pipe } from 'valibot';

export const EmissionScope1CategoryList = [
	'stationaryCombustion',
	'mobileCombustion',
	'fuelCombustion',
] as const;
export const EmissionScope2CategoryList = ['purchasedElectricity', 'purchasedHeat'] as const;
export const EmissionScope3CategoryList = [
	'purchasedGoodsAndServices',
	'capitalGoods',
	'fuelAndEnergyRelatedActivities',
	'upStreamTransportationAndDistribution',
	'wasteGeneratedInOperations',
	'businessTravel',
	'employeeCommute',
	'upStreamLeasedAssets',
	'downStreamTransportationAndDistribution',
	'processingOfSoldProducts',
	'useOfSoldProducts',
	'endOfLifeTreatmentOfSoldProducts',
	'downStreamLeasedAssets',
	'franchises',
	'investments',
] as const;
export const EmissionCategoryList = [
	...EmissionScope1CategoryList,
	...EmissionScope2CategoryList,
	...EmissionScope3CategoryList,
] as const;

export const EmissionCategorySchema = pipe(picklist(EmissionCategoryList), nonEmpty());

export type EmissionCategory = InferOutput<typeof EmissionCategorySchema>;
