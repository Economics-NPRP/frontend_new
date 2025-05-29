import { AuctionBiddingProvider } from '@/pages/marketplace/auction/[auctionId]/(details)/_components/Providers/AuctionBiddingProvider';
import { AuctionBidsProvider } from '@/pages/marketplace/auction/[auctionId]/(details)/_components/Providers/AuctionBidsProvider';
import { AuctionDetailsProvider } from '@/pages/marketplace/auction/[auctionId]/(details)/_components/Providers/AuctionDetailsProvider';

export const Providers = ({ children }: { children: React.ReactNode }) => {
	return (
		<AuctionBiddingProvider>
			<AuctionBidsProvider>
				<AuctionDetailsProvider>{children}</AuctionDetailsProvider>
			</AuctionBidsProvider>
		</AuctionBiddingProvider>
	);
};
