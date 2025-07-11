'use client';

import { useContext } from 'react';

import { FirmsTable } from '@/components/Tables/Firms';
import { PaginatedFirmsContext } from '@/contexts';

import classes from './styles.module.css';

export default function Table() {
	const paginatedFirms = useContext(PaginatedFirmsContext);

	return <FirmsTable className={classes.table} firms={paginatedFirms} />;
}
