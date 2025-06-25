'use server';

import 'server-only';
import { ServerData } from '@/types';
import { AuctionType } from '@/schema/models/AuctionType';

import { IPlaceBidOptions, placeBid as placeOpenBid } from './open/placeBid';
import { placeBid as placeSealedBid, PlaceBidOptions as SealedBidOptions } from './sealed/placeBid';
import { getPaginatedBids as placeOpenBidPaginated, IGetPaginatedBidsOptions as OpenBidOptions } from './open/getPaginatedBids';

export interface IPlaceBidV2Options extends IPlaceBidOptions {
	auctionType: AuctionType;
}

type IFunctionSignature = (options: IPlaceBidV2Options) => Promise<ServerData<{}>>;

export const placeBid: IFunctionSignature = async (options) => {
	const { auctionType, ...rest } = options;

	if (auctionType === 'sealed') {
		return placeSealedBid(rest);
	}

	return placeOpenBid(rest);
};

export async function placeBidPaginated(options: (OpenBidOptions | SealedBidOptions) & { auctionType: AuctionType }): Promise<any> {
	return placeOpenBidPaginated(options);
} 