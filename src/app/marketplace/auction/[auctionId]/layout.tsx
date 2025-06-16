import { Metadata } from 'next';
import { PropsWithChildren } from 'react';

import { SingleAuctionProvider } from '@/contexts';
import { withProviders } from '@/helpers';
import { getSingleAuction } from '@/lib/auctions';

type Props = {
	params: Promise<{ auctionId: string }>;
};
export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
	const { auctionId } = await params;
	const auction = getSingleAuction(auctionId);
	if (!auction) {
		return {
			title: {
				default: 'Auction Not Found | ETS Marketplace',
				template: '%s - Auction Not Found | ETS Marketplace',
			},
		};
	}
	return {
		title: {
			default: 'Flare Gas Burning | ETS Marketplace',
			template: '%s - Flare Gas Burning | ETS Marketplace',
		},
	};
};

export default function AuctionLayout({ children }: PropsWithChildren) {
	return withProviders(<>{children}</>, { provider: SingleAuctionProvider });
}
