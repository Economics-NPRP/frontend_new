import { AuctionCategory } from '@/types';

export type IdVariantType = 'company' | AuctionCategory;

export const IdPrefixes: Partial<Record<IdVariantType, string>> = {
	company: 'CO',
	industry: 'IN',
};
