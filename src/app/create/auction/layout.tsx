import { AllSubsectorsProvider } from 'contexts/AllSubsectors';
import { Metadata } from 'next';
import { ReactNode } from 'react';

import { withProviders } from '@/helpers';
import { SectorChangeModalProvider } from '@/pages/create/auction/_components/SectorChangeModal';

export const metadata: Metadata = {
	title: 'Create New Auction',
};

export interface CreateAuctionProps {
	form: ReactNode;
}
export default function CreateAuction({ form }: CreateAuctionProps) {
	return withProviders(
		<>{form}</>,
		{ provider: SectorChangeModalProvider },
		{ provider: AllSubsectorsProvider },
	);
}
