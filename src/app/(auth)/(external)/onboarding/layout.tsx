"use client"
import { useTranslations } from 'next-intl';
import { ReactNode, useContext, useEffect } from 'react';

import { OnBoardingContext, OnBoardingProvider } from '@/contexts';
import { withProviders } from '@/helpers';
import classes from '@/pages/(auth)/(external)/styles.module.css';
import { Stack, Text, Title } from '@mantine/core';

export interface OnboardingProps {
	details: ReactNode;
	form: ReactNode;
}

function OnboardingContent({ details, form }: OnboardingProps) {
	const t = useTranslations();
	const onboardingContext = useContext(OnBoardingContext);

	useEffect(() => {
		console.log('OnboardingContext', onboardingContext);
	}, [onboardingContext]);

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

export default function Onboarding(props: OnboardingProps) {
	return withProviders(
		<OnboardingContent {...props} />,
		{ provider: OnBoardingProvider, props: { tokenSource: 'searchParams' } },
	);
}
