import { SingleAuctionContext } from 'contexts/SingleAuction';
import { useContext, useMemo } from 'react';

export const useAuctionAvailability = () => {
	const auction = useContext(SingleAuctionContext);

	const areBidsAvailable = useMemo(
		() =>
			auction.isSuccess &&
			(auction.data.type === 'open' ||
				(auction.data.type === 'sealed' &&
					auction.data.hasJoined &&
					new Date(auction.data.endDatetime).getTime() < Date.now())),
		[auction.data.type, auction.data.hasJoined, auction.data.endDatetime],
	);

	//	TODO: for sealed auctions, wait till authority publishes results
	const areResultsAvailable = useMemo(
		() =>
			auction.isSuccess &&
			auction.data.hasJoined &&
			(auction.data.type === 'open' ||
				(auction.data.type === 'sealed' &&
					new Date(auction.data.endDatetime).getTime() < Date.now())),
		[auction.data.type, auction.data.hasJoined, auction.data.endDatetime],
	);

	return {
		areBidsAvailable,
		areResultsAvailable,
	};
};
