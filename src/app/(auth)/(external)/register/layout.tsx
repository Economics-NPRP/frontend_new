import { Metadata } from 'next';
import { ReactNode } from 'react';

import classes from '@/pages/(auth)/(external)/styles.module.css';
import { Stack, Text, Title } from '@mantine/core';

export const metadata: Metadata = {
	title: 'Register',
};

export interface RegisterProps {
	form: ReactNode;
}
export default function Register({ form }: RegisterProps) {
	return (
		<>
			<Stack className={`${classes.header} ${classes.section}`}>
				<Title className={classes.heading}>Welcome to ETS!</Title>
				<Text className={classes.subheading}>
					Please complete the following steps to register your account.
				</Text>
			</Stack>
			{form}
		</>
	);
}
