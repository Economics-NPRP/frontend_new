'use client';

import { AllSubsectorsBySectorContext } from 'contexts/AllSubsectorsBySector';
import Link from 'next/link';
import { useContext } from 'react';

import { SmallSubsectorCard } from '@/components/SubsectorCard';
import { Group } from '@mantine/core';

import classes from './styles.module.css';

export default function List() {
	const allSubsectors = useContext(AllSubsectorsBySectorContext);

	return (
		<Group className={classes.root}>
			{allSubsectors.data.results.map((subsector) => (
				<SmallSubsectorCard
					className={classes.card}
					key={subsector.id}
					subsector={subsector}
					component={Link}
					href={`/dashboard/a/cycles/sectors/${subsector.sector}/${subsector.id}`}
				/>
			))}
		</Group>
	);
}
