'use client';

import { useContext } from 'react';

import { AuctionsTable } from '@/components/Tables/Auctions';
import { PaginatedAuctionsContext } from '@/contexts';

import classes from './styles.module.css';

export default function Table() {
	const paginatedAuctions = useContext(PaginatedAuctionsContext);

	//	TODO: disable changing sector and set default sector filter to current sector
	return <AuctionsTable className={classes.table} auctions={paginatedAuctions} />;
}
