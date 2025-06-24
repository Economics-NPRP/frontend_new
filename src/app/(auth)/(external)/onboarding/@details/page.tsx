'use client';

// import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import classes from '@/pages/(auth)/(external)/styles.module.css';
import { Anchor, Avatar, Group, Stack, Text, Title } from '@mantine/core';
import { IconMail, IconPhone } from '@tabler/icons-react';

export default function Details() {
	const t = useTranslations();
	// const searchParams = useSearchParams();

	return (
		<Stack className={classes.section}>
			<Group className={classes.details}>
				<Avatar
					className={classes.avatar}
					name={'Test Firm'}
					color="initials"
					size={'lg'}
				/>
				<Stack className={classes.column}>
					<Title className={classes.heading}>Test Firm</Title>
					<Group className={classes.row}>
						<IconMail size={16} />
						<Text className={classes.subheading}>firm@email.com</Text>
					</Group>
					<Group className={classes.row}>
						<IconPhone size={16} />
						<Text className={classes.subheading}>+974 1234 5678</Text>
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
