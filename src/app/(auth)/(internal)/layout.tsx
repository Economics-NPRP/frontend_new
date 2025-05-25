import { ReactNode } from 'react';

import Background from '@/pages/(auth)/(internal)/(components)/(background)/page';
import classes from '@/pages/(auth)/styles.module.css';
import { Stack } from '@mantine/core';

export interface AuthProps {
	children: ReactNode;
}
export default function Auth({ children }: AuthProps) {
	return (
		<Stack className={classes.root}>
			<Background />
			<Stack className={classes.panel}>{children}</Stack>
		</Stack>
	);
}
