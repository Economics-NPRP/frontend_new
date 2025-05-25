import { ReactNode } from 'react';

import { Background } from '@/pages/(auth)/(internal)/(components)/(background)';
import classes from '@/pages/(auth)/(internal)/styles.module.css';
import { Stack } from '@mantine/core';

export interface AuthInternalProps {
	children: ReactNode;
}
export default function AuthInternal({ children }: AuthInternalProps) {
	return (
		<Stack className={classes.root}>
			<Background />
			<Stack className={classes.panel}>{children}</Stack>
		</Stack>
	);
}
