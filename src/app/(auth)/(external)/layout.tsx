import { ReactNode } from 'react';

import { Header } from '@/pages/(auth)/(external)/(components)/(header)';
import classes from '@/pages/(auth)/(external)/styles.module.css';
import { Stack } from '@mantine/core';

export interface AuthExternalProps {
	children: ReactNode;
}
export default function AuthExternal({ children }: AuthExternalProps) {
	return (
		<Stack className={classes.root}>
			<Header />
			<Stack className={classes.content}>{children}</Stack>
		</Stack>
	);
}
