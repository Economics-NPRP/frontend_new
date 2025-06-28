import { AuctionCategory } from '@/types';

export type IdVariantType = 'company' | 'auctionCycle' | AuctionCategory;

export const IdPrefixes: Partial<Record<IdVariantType, string>> = {
	company: 'CO',
	auctionCycle: 'CY',
	energy: 'EN',
	industry: 'IN',
	transport: 'TR',
	buildings: 'BU',
	agriculture: 'AG',
	waste: 'WA',
};
