import { Metadata } from 'next';
import { useTranslations } from 'next-intl';
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
	const t = useTranslations();

	return (
		<>
			<Stack className={`${classes.header} ${classes.section}`}>
				<Title className={classes.heading}>{t('auth.onboarding.heading')}</Title>
				<Text className={classes.subheading}>{t('auth.onboarding.subheading')}</Text>
			</Stack>
			{details}
			{form}
		</>
	);
}
