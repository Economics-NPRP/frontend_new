'use client';

// import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useContext, useEffect } from 'react';
import Link from 'next/link';

import classes from '@/pages/(auth)/(external)/styles.module.css';
import { Anchor, Avatar, Group, Stack, Text, Title } from '@mantine/core';
import { OnBoardingContext } from 'contexts/OnboardingData';
import { IconMail, IconPhone } from '@tabler/icons-react';
import { WithSkeleton } from '@/components/WithSkeleton';

export default function Details() {
	const t = useTranslations();
	const firmData = useContext(OnBoardingContext);

	useEffect(() => {
		console.log('OnboardingContext', firmData);
	}, [firmData]);

	return (
		<Stack className={classes.section}>
			<Group className={classes.details}>
				<Avatar
					className={classes.avatar}
					name={firmData.isLoading ? '..' : firmData.data.name}
					color="initials"
					size={'lg'}
				/>
				<Stack className={classes.column}>
					<WithSkeleton h={16} w={100} loading={firmData.isLoading}>
						<Title className={classes.heading}>{firmData.data.name}</Title>
					</WithSkeleton>
					<Group className={classes.row}>
						<IconMail size={16} />
						<WithSkeleton h={12} w={120} loading={firmData.isLoading}>
							<Text className={classes.subheading}>{firmData.data.email}</Text>
						</WithSkeleton>
					</Group>
					<Group className={classes.row}>
						<IconPhone size={16} />
						<WithSkeleton loading={firmData.isLoading} h={12} w={100}>
							<Text className={classes.subheading}>{firmData.data.phone}</Text>
						</WithSkeleton>
					</Group>
				</Stack>
			</Group>
			<Group className={classes.prompt}>
				<Text className={classes.text}>
					{t.rich('auth.onboarding.details.prompt', {
						a: (chunks) => (
							<Anchor component={Link} className={classes.link} href="/register">
								{chunks}
							</Anchor>
						),
					})}
				</Text>
			</Group>
		</Stack>
	);
}
