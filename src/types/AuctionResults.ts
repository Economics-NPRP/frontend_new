import { IBidData } from '@/schema/models';

export interface IAuctionResultsData {
	auctionId: string;
	firmId: string;
	finalBill: number;
	permitsReserved: number;
	totalBidsCount: number;
	winningBidsCount: number;
	averagePricePerPermit: number;
	auctionStatus: 'ended';
	contributingLosingBids: Array<IBidData>;
	clearanceBid: IBidData | null;
}

export const DefaultAuctionResultsData: IAuctionResultsData = {
	auctionId: '',
	firmId: '',
	finalBill: 0,
	permitsReserved: 0,
	totalBidsCount: 0,
	winningBidsCount: 0,
	averagePricePerPermit: 0,
	auctionStatus: 'ended',
	contributingLosingBids: [],
	clearanceBid: null,
};
