import { ReactNode } from 'react';

import { Header } from '@/pages/(auth)/(external)/_components/Header';
import classes from '@/pages/(auth)/(external)/styles.module.css';
import { Container, Stack } from '@mantine/core';

export interface AuthExternalProps {
	children: ReactNode;
}
export default function AuthExternal({ children }: AuthExternalProps) {
	return (
		<Stack className={classes.root}>
			<Container className={classes.bg}>
				<Container className={classes.graphic} />
				<Container className={classes.graphic} />
				<Container className={classes.graphic} />
			</Container>
			<Header />
			<Stack className={classes.content}>{children}</Stack>
		</Stack>
	);
}
