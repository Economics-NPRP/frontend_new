'use client';

import { DateTime } from 'luxon';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { BaseBadge } from '@/components/Badge';
import { MediumCountdown } from '@/components/Countdown';
import { DashboardHero } from '@/pages/dashboard/_components/DashboardHero';
import { Stack, Text } from '@mantine/core';
import { IconAlertTriangle, IconCheck, IconLeaf, IconX } from '@tabler/icons-react';

import classes from './styles.module.css';

export default function Hero() {
	const t = useTranslations();

	const complianceBadge = useMemo(() => {
		const x = Math.random();
		if (x <= 0.5)
			return (
				<BaseBadge
					className={classes.badge}
					color={'green'}
					rightSection={<IconCheck size={16} />}
				>
					{t('constants.compliance.compliant.label')}
				</BaseBadge>
			);
		if (x <= 0.75)
			return (
				<BaseBadge
					className={classes.badge}
					color={'yellow'}
					rightSection={<IconAlertTriangle size={14} />}
				>
					{t('constants.compliance.risk.label')}
				</BaseBadge>
			);
		return (
			<BaseBadge className={classes.badge} color={'red'} rightSection={<IconX size={16} />}>
				{t('constants.compliance.deficit.label')}
			</BaseBadge>
		);
	}, [t]);

	return (
		<DashboardHero
			className={classes.root}
			icon={<IconLeaf size={24} />}
			title={t('constants.pages.dashboard.firm.carbon.pe.title')}
			description={t('constants.pages.dashboard.firm.carbon.pe.description')}
			returnButton={{ href: '/dashboard/f', label: t('constants.return.home.label') }}
			badges={complianceBadge}
			actions={
				<Stack className={classes.actions}>
					<Text className={classes.label}>
						{t('dashboard.firm.carbon.pe.actions.label')}
					</Text>
					<MediumCountdown targetDate={DateTime.now().plus({ months: 6 }).toISO()} />
				</Stack>
			}
			breadcrumbs={[
				{
					label: t('constants.pages.dashboard.admin.home.title'),
					href: '/dashboard/f',
				},
				{
					label: t('constants.pages.dashboard.firm.carbon.title'),
				},
				{
					label: t('constants.pages.dashboard.firm.carbon.pe.title'),
					href: '/dashboard/f/carbon/pe',
				},
			]}
		/>
	);
}
