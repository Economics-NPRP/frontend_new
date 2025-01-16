import { ReactNode } from 'react';

import { Container } from '@mantine/core';

import classes from './styles.module.css';

export interface HomeProps {
	banner: ReactNode;
	subbanners: ReactNode;
	categories: ReactNode;
	calendar: ReactNode;
	ending: ReactNode;
	catalogue: ReactNode;
}
export default function Home({
	banner,
	subbanners,
	categories,
	calendar,
	ending,
	catalogue,
}: HomeProps) {
	return (
		<Container className={classes.root}>
			<Container className={classes.banners}>
				{banner}
				{subbanners}
			</Container>
			{categories}
			{calendar}
			{ending}
			{catalogue}
		</Container>
	);
}
