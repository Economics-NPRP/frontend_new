'use client';

import { useContext } from 'react';

import { AuctionsTable } from '@/components/Tables/Auctions';
import { PaginatedAuctionsContext } from '@/contexts';

import classes from './styles.module.css';

export default function Table() {
	const paginatedAuctions = useContext(PaginatedAuctionsContext);

	//	TODO: Set default subsector filter to current subsector
	return <AuctionsTable className={classes.table} auctions={paginatedAuctions} />;
}
