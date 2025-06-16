import { SingleAuctionContext } from 'contexts/SingleAuction';
import { useContext, useMemo } from 'react';

import { IAuctionData } from '@/schema/models';

export const ENDING_SOON_THRESHOLD = 1000 * 60 * 60 * 24 * 3; // 3 days

export const useAuctionAvailability = (defaultAuction?: IAuctionData) => {
	const auction = defaultAuction
		? { data: defaultAuction, isSuccess: true }
		: useContext(SingleAuctionContext);

	//	TODO: refresh when auction ends
	const isUpcoming = useMemo(
		() => auction.isSuccess && new Date(auction.data.startDatetime).getTime() > Date.now(),
		[auction.data.startDatetime, auction.isSuccess],
	);

	//	TODO: refresh when auction ends
	const hasEnded = useMemo(
		() => auction.isSuccess && new Date(auction.data.endDatetime).getTime() < Date.now(),
		[auction.data.endDatetime, auction.isSuccess],
	);

	//	TODO: refresh when auction ends
	const isLive = useMemo(
		() => auction.isSuccess && !isUpcoming && !hasEnded,
		[auction.isSuccess, isUpcoming, hasEnded],
	);

	//	TODO: refresh when auction ends
	const isEndingSoon = useMemo(
		() =>
			auction.isSuccess &&
			!hasEnded &&
			new Date(auction.data.endDatetime).getTime() - Date.now() < ENDING_SOON_THRESHOLD,
		[auction.data.endDatetime, hasEnded, auction.isSuccess],
	);

	//	TODO: refresh when auction ends
	const areBidsAvailable = useMemo(
		() =>
			auction.isSuccess &&
			(auction.data.type === 'open' ||
				(auction.data.type === 'sealed' && auction.data.hasJoined && hasEnded)),
		[auction.data.type, auction.data.hasJoined, hasEnded, auction.isSuccess],
	);

	//	TODO: for sealed auctions, wait till authority publishes results
	const areResultsAvailable = useMemo(
		() =>
			auction.isSuccess &&
			auction.data.hasJoined &&
			(auction.data.type === 'open' || (auction.data.type === 'sealed' && hasEnded)),
		[auction.data.type, auction.data.hasJoined, hasEnded, auction.isSuccess],
	);

	return {
		isUpcoming,
		hasEnded,
		isLive,
		isEndingSoon,
		areBidsAvailable,
		areResultsAvailable,
	};
};
