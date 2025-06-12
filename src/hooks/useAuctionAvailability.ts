import { SingleAuctionContext } from 'contexts/SingleAuction';
import { useContext, useMemo } from 'react';

export const useAuctionAvailability = () => {
	const auction = useContext(SingleAuctionContext);

	//	TODO: refresh when auction ends
	const isUpcoming = useMemo(
		() => new Date(auction.data.startDatetime).getTime() > Date.now(),
		[auction.data.startDatetime],
	);

	//	TODO: refresh when auction ends
	const hasEnded = useMemo(
		() => new Date(auction.data.endDatetime).getTime() < Date.now(),
		[auction.data.endDatetime],
	);

	//	TODO: refresh when auction ends
	const areBidsAvailable = useMemo(
		() =>
			auction.isSuccess &&
			(auction.data.type === 'open' ||
				(auction.data.type === 'sealed' && auction.data.hasJoined && hasEnded)),
		[auction.data.type, auction.data.hasJoined, hasEnded],
	);

	//	TODO: for sealed auctions, wait till authority publishes results
	const areResultsAvailable = useMemo(
		() =>
			auction.isSuccess &&
			auction.data.hasJoined &&
			(auction.data.type === 'open' || (auction.data.type === 'sealed' && hasEnded)),
		[auction.data.type, auction.data.hasJoined, hasEnded],
	);

	return {
		isUpcoming,
		hasEnded,
		areBidsAvailable,
		areResultsAvailable,
	};
};
