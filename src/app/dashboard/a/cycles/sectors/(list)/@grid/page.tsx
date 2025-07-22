import Link from 'next/link';

import { LargeSectorCard } from '@/components/SectorCard';
import { Container } from '@mantine/core';

import classes from './styles.module.css';

export default function Grid() {
	return (
		<Container className={classes.root}>
			<LargeSectorCard
				className={classes.card}
				sector="energy"
				unit="subsectors"
				component={Link}
				href="/dashboard/a/cycles/sectors/energy"
			/>
			<LargeSectorCard
				className={classes.card}
				sector="industry"
				unit="subsectors"
				component={Link}
				href="/dashboard/a/cycles/sectors/industry"
			/>
			<LargeSectorCard
				className={classes.card}
				sector="transport"
				unit="subsectors"
				component={Link}
				href="/dashboard/a/cycles/sectors/transport"
			/>
			<LargeSectorCard
				className={classes.card}
				sector="buildings"
				unit="subsectors"
				component={Link}
				href="/dashboard/a/cycles/sectors/buildings"
			/>
			<LargeSectorCard
				className={classes.card}
				sector="agriculture"
				unit="subsectors"
				component={Link}
				href="/dashboard/a/cycles/sectors/agriculture"
			/>
			<LargeSectorCard
				className={classes.card}
				sector="waste"
				unit="subsectors"
				component={Link}
				href="/dashboard/a/cycles/sectors/waste"
			/>
		</Container>
	);
}
