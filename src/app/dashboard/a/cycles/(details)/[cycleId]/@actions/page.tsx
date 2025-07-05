'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { ActionBanner } from '@/components/ActionBanner';
import { Container } from '@mantine/core';
import { IconCirclePlus, IconLicense, IconTargetArrow } from '@tabler/icons-react';

import classes from './styles.module.css';

export default function SubBanners() {
	const t = useTranslations();
	const { cycleId } = useParams();

	return (
		<Container className={classes.root}>
			<ActionBanner
				className={classes.banner}
				icon={<IconCirclePlus size={32} />}
				heading={t('dashboard.admin.cycles.details.actions.create.heading')}
				subheading={t('dashboard.admin.cycles.details.actions.create.subheading')}
				component={Link}
				href="/create/auction"
				index={1}
			/>
			<ActionBanner
				className={classes.banner}
				icon={<IconLicense size={32} />}
				heading={t('dashboard.admin.cycles.details.actions.permits.heading')}
				subheading={t('dashboard.admin.cycles.details.actions.permits.subheading')}
				component={Link}
				href={`/dashboard/a/cycles/permits/${cycleId}`}
				index={2}
			/>
			<ActionBanner
				className={classes.banner}
				icon={<IconTargetArrow size={32} />}
				heading={t('dashboard.admin.cycles.details.actions.kpis.heading')}
				subheading={t('dashboard.admin.cycles.details.actions.kpis.subheading')}
				component={Link}
				href={`/create/cycle?id=${cycleId}`}
				index={3}
			/>
		</Container>
	);
}
