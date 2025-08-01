import { DateTime } from 'luxon';
import { useTranslations } from 'next-intl';

import { MediumCountdown } from '@/components/Countdown';
import { DashboardHero } from '@/pages/dashboard/_components/DashboardHero';
import { Stack, Text } from '@mantine/core';
import { IconLeaf } from '@tabler/icons-react';

import classes from './styles.module.css';

export default function Hero() {
	const t = useTranslations();

	return (
		<DashboardHero
			className={classes.root}
			icon={<IconLeaf size={24} />}
			title={t('constants.pages.dashboard.firm.carbon.pe.title')}
			description={t('constants.pages.dashboard.firm.carbon.pe.description')}
			returnButton={{ href: '/dashboard/f', label: t('constants.return.home.label') }}
			actions={
				<Stack className={classes.actions}>
					<Text className={classes.label}>
						{t('dashboard.firm.carbon.pe.actions.label')}
					</Text>
					<MediumCountdown targetDate={DateTime.now().plus({ months: 6 })} />
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
