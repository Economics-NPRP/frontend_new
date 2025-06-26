'use client';

import { useContext } from 'react';

import { FirmApplicationsTable } from '@/components/Tables/FirmApplications';
import { PaginatedFirmApplicationsContext } from '@/contexts';

import classes from './styles.module.css';

export default function Table() {
	const paginatedFirmApplications = useContext(PaginatedFirmApplicationsContext);

	return (
		<FirmApplicationsTable
			className={classes.table}
			firmApplications={paginatedFirmApplications}
		/>
	);
}
