import { LargeSectorCard } from '@/components/SectorCard';
import { Container } from '@mantine/core';

import classes from './styles.module.css';

export default function Grid() {
	return (
		<Container className={classes.root}>
			<LargeSectorCard className={classes.card} sector="energy" unit="subsectors" />
			<LargeSectorCard className={classes.card} sector="industry" unit="subsectors" />
			<LargeSectorCard className={classes.card} sector="transport" unit="subsectors" />
			<LargeSectorCard className={classes.card} sector="buildings" unit="subsectors" />
			<LargeSectorCard className={classes.card} sector="agriculture" unit="subsectors" />
			<LargeSectorCard className={classes.card} sector="waste" unit="subsectors" />
		</Container>
	);
}
