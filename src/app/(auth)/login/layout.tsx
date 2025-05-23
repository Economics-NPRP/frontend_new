import { ReactNode } from 'react';

import { Stack, Text, Title } from '@mantine/core';
import { IconBox } from '@tabler/icons-react';

import classes from '../styles.module.css';

export interface LoginProps {
	form: ReactNode;
}
export default function Login({ form }: LoginProps) {
	return (
		<>
			<Stack className={`${classes.header} ${classes.section}`}>
				<IconBox size={24} />
				<Title className={classes.heading}>Login to ETS</Title>
				<Text className={classes.subheading}>
					Welcome to the ETS platform, where you can trade carbon credits and manage
					emissions.
				</Text>
			</Stack>
			{form}
		</>
	);
}
