import { AuctionCategory } from '@/types';

export type IdVariantType = 'company' | AuctionCategory;

export const IdPrefixes: Partial<Record<IdVariantType, string>> = {
	company: 'CO',
	energy: 'EN',
	industry: 'IN',
	transport: 'TR',
	buildings: 'BU',
	agriculture: 'AG',
	waste: 'WA',
};
