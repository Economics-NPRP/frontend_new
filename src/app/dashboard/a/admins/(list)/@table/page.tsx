'use client';

import { useContext } from 'react';

import { AdminsTable } from '@/components/Tables/Admins';
import { PaginatedAdminsContext } from '@/contexts';

import classes from './styles.module.css';

export default function Table() {
	const paginatedAdmins = useContext(PaginatedAdminsContext);

	return <AdminsTable className={classes.table} admins={paginatedAdmins} />;
}
