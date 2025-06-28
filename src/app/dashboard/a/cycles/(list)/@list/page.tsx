'use client';

import { PaginatedAuctionCyclesContext } from 'contexts/PaginatedAuctionCycles';
import { useContext } from 'react';

import { AuctionCyclesTable } from '@/components/Tables/AuctionCycles';

export default function CyclesListComponent() {
	const paginatedAuctionCycles = useContext(PaginatedAuctionCyclesContext);

	return <AuctionCyclesTable auctionCycles={paginatedAuctionCycles} />;
}
