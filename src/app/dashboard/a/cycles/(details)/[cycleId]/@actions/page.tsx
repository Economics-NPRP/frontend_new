'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useContext } from 'react';

import { ActionBanner } from '@/components/ActionBanner';
import { ApprovalModalContext } from '@/pages/dashboard/a/cycles/(details)/[cycleId]/_components/ApprovalModal';
import { Container } from '@mantine/core';
import {
	IconCirclePlus,
	IconLicense,
	IconRosetteDiscountCheck,
	IconTargetArrow,
} from '@tabler/icons-react';

import classes from './styles.module.css';

export default function SubBanners() {
	const t = useTranslations();
	const { cycleId } = useParams();
	const { open } = useContext(ApprovalModalContext);

	return (
		<Container className={classes.root}>
			{/* TODO: disable actions based on current role once implemented */}
			<ActionBanner
				className={classes.banner}
				icon={<IconCirclePlus size={32} />}
				heading={t('dashboard.admin.cycles.details.actions.create.heading')}
				subheading={t('dashboard.admin.cycles.details.actions.create.subheading')}
				component={Link}
				href={`/create/auction?cycleId=${cycleId}`}
				index={3}
			/>
			<ActionBanner
				className={classes.banner}
				icon={<IconLicense size={32} />}
				heading={t('dashboard.admin.cycles.details.actions.permits.heading')}
				subheading={t('dashboard.admin.cycles.details.actions.permits.subheading')}
				component={Link}
				href={`/dashboard/a/cycles/permits/${cycleId}`}
				index={4}
			/>
			<ActionBanner
				className={classes.banner}
				icon={<IconTargetArrow size={32} />}
				heading={t('dashboard.admin.cycles.details.actions.kpis.heading')}
				subheading={t('dashboard.admin.cycles.details.actions.kpis.subheading')}
				component={Link}
				href={`/create/cycle?id=${cycleId}`}
				index={2}
			/>
			<ActionBanner
				className={classes.banner}
				icon={<IconRosetteDiscountCheck size={32} />}
				heading={t('dashboard.admin.cycles.details.actions.approve.heading')}
				subheading={t('dashboard.admin.cycles.details.actions.approve.subheading')}
				index={1}
				onClick={open}
			/>
		</Container>
	);
}
