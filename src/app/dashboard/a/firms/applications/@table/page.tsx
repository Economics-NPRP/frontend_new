'use client';

import { useContext } from 'react';

import { FirmApplicationsTable } from '@/components/Tables/FirmApplications';
import { PaginatedFirmsContext } from '@/contexts';

import classes from './styles.module.css';

export default function Table() {
	const paginatedFirms = useContext(PaginatedFirmsContext);

	return <FirmApplicationsTable className={classes.table} firms={paginatedFirms} />;
}
