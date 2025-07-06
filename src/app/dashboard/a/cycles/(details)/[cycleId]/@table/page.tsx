'use client';

import { useContext } from 'react';

import { AuctionsTable } from '@/components/Tables/Auctions';
import { PaginatedAuctionsInCycleContext } from '@/contexts';

import classes from './styles.module.css';

export default function Table() {
	const paginatedAuctions = useContext(PaginatedAuctionsInCycleContext);

	return <AuctionsTable className={classes.table} auctions={paginatedAuctions} />;
}
