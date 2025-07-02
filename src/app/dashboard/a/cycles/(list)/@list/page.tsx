'use client';

import { PaginatedAuctionCyclesContext } from 'contexts/PaginatedAuctionCycles';
import { useContext } from 'react';

import { AuctionCyclesTable } from '@/components/Tables/AuctionCycles';

import classes from './styles.module.css';

export default function CyclesListComponent() {
	const paginatedAuctionCycles = useContext(PaginatedAuctionCyclesContext);

	return <AuctionCyclesTable className={classes.table} auctionCycles={paginatedAuctionCycles} />;
}
