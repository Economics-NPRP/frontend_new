import { SectorType } from '@/schema/models';

export type IdVariantType = 'company' | 'auctionCycle' | 'crn' | 'auction' | SectorType;

export const IdPrefixes: Partial<Record<IdVariantType, string>> = {
	company: 'CO',
	auctionCycle: 'CY',
	energy: 'EN',
	industry: 'IN',
	transport: 'TR',
	buildings: 'BU',
	agriculture: 'AG',
	waste: 'WA',
	crn: 'CRN',
	auction: 'AU'
};
