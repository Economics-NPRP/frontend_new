import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { ActionBanner } from '@/components/ActionBanner';
import { StatCard } from '@/components/StatCard';
import { Container } from '@mantine/core';
import {
	IconChartAreaLine,
	IconCirclePlus,
	IconHourglassHigh,
	IconPackages,
	IconSettings,
} from '@tabler/icons-react';

import classes from './styles.module.css';

export default function Subbanners() {
	const t = useTranslations();

	return (
		<>
			<Container className={classes.stats}>
				<StatCard
					className={classes.stat}
					icon={<IconPackages size={80} />}
					title={t('dashboard.firm.carbon.pe.stats.avgPermits.title')}
					tooltip={t('dashboard.firm.carbon.pe.stats.avgPermits.tooltip')}
					type="double"
					value={Math.random() * 1000}
				/>
				<StatCard
					className={classes.stat}
					icon={<IconSettings size={80} />}
					title={t('dashboard.firm.carbon.pe.stats.efficiency.title')}
					tooltip={t('dashboard.firm.carbon.pe.stats.efficiency.tooltip')}
					type="percentage"
					value={Math.random() * 100}
				/>
				<StatCard
					className={classes.stat}
					icon={<IconHourglassHigh size={80} />}
					title={t('dashboard.firm.carbon.pe.stats.age.title')}
					tooltip={t('dashboard.firm.carbon.pe.stats.age.tooltip')}
					type="double"
					value={Math.random() * 10}
				/>
				<StatCard
					className={classes.stat}
					icon={<IconChartAreaLine size={80} />}
					title={t('dashboard.firm.carbon.pe.stats.deficit.title')}
					tooltip={t('dashboard.firm.carbon.pe.stats.deficit.tooltip')}
					type="double"
					value={Math.random() * 2000 - 1000}
				/>
			</Container>
			<ActionBanner
				className={classes.cta}
				icon={<IconCirclePlus size={32} />}
				heading={t('dashboard.firm.carbon.pe.report.heading')}
				subheading={t('dashboard.firm.carbon.pe.report.subheading')}
				component={Link}
				href="/dashboard/f/carbon/report"
				index={1}
				style={{ height: '100%' }}
			/>
		</>
	);
}
