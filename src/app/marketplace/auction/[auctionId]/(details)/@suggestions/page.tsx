'use client';

import { InfinitePaginatedAuctionsContext } from 'contexts/InfinitePaginatedAuctions';
import { useContext } from 'react';

import { AuctionCarousel } from '@/components/AuctionCarousel';

export default function Suggestions() {
	const infinitePaginatedAuctions = useContext(InfinitePaginatedAuctionsContext);

	return <AuctionCarousel infinitePaginatedAuctions={infinitePaginatedAuctions} />;
}
