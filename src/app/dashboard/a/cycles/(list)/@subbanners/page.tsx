import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { ActionBanner } from '@/components/ActionBanner';
import { Group } from '@mantine/core';
import { IconCirclePlus, IconStackFront } from '@tabler/icons-react';

import classes from './styles.module.css';

export default function SubBanners() {
	const t = useTranslations();

	return (
		<Group className={classes.root}>
			<ActionBanner
				icon={<IconCirclePlus size={32} />}
				heading={t('dashboard.admin.cycles.actions.create.heading')}
				subheading={t('dashboard.admin.cycles.actions.create.subheading')}
				component={Link}
				href="/dashboard/a/cycles/create"
			/>
			<ActionBanner
				icon={<IconStackFront size={32} />}
				heading={t('dashboard.admin.cycles.actions.presets.heading')}
				subheading={t('dashboard.admin.cycles.actions.presets.subheading')}
				component={Link}
				href="/dashboard/a/cycles/presets"
			/>
		</Group>
	);
}
