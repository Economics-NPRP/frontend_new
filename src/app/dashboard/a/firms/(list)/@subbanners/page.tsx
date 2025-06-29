import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { ActionBanner } from '@/components/ActionBanner';
import { Group, Mark } from '@mantine/core';
import { IconAlertHexagon, IconCreditCard, IconFileSearch } from '@tabler/icons-react';

import classes from './styles.module.css';

export default function SubBanners() {
	const t = useTranslations();

	return (
		<Group className={classes.root}>
			<ActionBanner
				icon={<IconFileSearch size={32} />}
				heading={t('dashboard.admin.firms.subbanner.1.heading')}
				subheading={t.rich('dashboard.admin.firms.subbanner.1.text', {
					value: Math.round(Math.random() * 1000),
					mark: (chunks) => <Mark className={classes.highlight}>{chunks}</Mark>,
				})}
				component={Link}
				href="/dashboard/a/firms/applications"
			/>
			<ActionBanner
				icon={<IconAlertHexagon size={32} />}
				heading={t('dashboard.admin.firms.subbanner.2.heading')}
				subheading={t.rich('dashboard.admin.firms.subbanner.2.text', {
					value: Math.round(Math.random() * 1000),
				})}
				component={Link}
				href="/dashboard/a/firms/audits"
			/>
			<ActionBanner
				icon={<IconCreditCard size={32} />}
				heading={t('dashboard.admin.firms.subbanner.3.heading')}
				subheading={t.rich('dashboard.admin.firms.subbanner.3.text', {
					value: Math.round(Math.random() * 100),
					mark: (chunks) => <Mark className={classes.highlight}>{chunks}</Mark>,
				})}
				component={Link}
				href="/dashboard/a/firms/transactions"
			/>
		</Group>
	);
}
