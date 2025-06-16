import { Metadata } from 'next';
import { ReactNode } from 'react';

import classes from '@/pages/(auth)/(external)/styles.module.css';
import { Stack, Text, Title } from '@mantine/core';

export const metadata: Metadata = {
	title: 'Onboarding',
};

export interface OnboardingProps {
	details: ReactNode;
	form: ReactNode;
}
export default function Onboarding({ details, form }: OnboardingProps) {
	return (
		<>
			<Stack className={`${classes.header} ${classes.section}`}>
				<Title className={classes.heading}>Welcome to ETS!</Title>
				<Text className={classes.subheading}>
					Please complete the following steps to activate your account.
				</Text>
			</Stack>
			{details}
			{form}
		</>
	);
}
