import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { ActionBanner } from '@/components/ActionBanner';
import { Mark } from '@mantine/core';
import { IconAward, IconBellRinging, IconCirclePlus } from '@tabler/icons-react';

import classes from './styles.module.css';

export default function SubBanners() {
	const t = useTranslations();

	return (
		<>
			<ActionBanner
				icon={<IconBellRinging size={32} />}
				heading={t('marketplace.home.subbanner.1.heading')}
				subheading={t.rich('marketplace.home.subbanner.1.text', {
					value: Math.round(Math.random() * 1000),
					mark: (chunks) => <Mark className={classes.highlight}>{chunks}</Mark>,
				})}
				component={Link}
				href=""
				className={classes.root}
			/>
			<ActionBanner
				icon={<IconCirclePlus size={32} />}
				heading={t('marketplace.home.subbanner.2.heading')}
				subheading={t('marketplace.home.subbanner.2.text')}
				component={Link}
				href=""
				className={classes.root}
			/>
			<ActionBanner
				icon={<IconAward size={32} />}
				heading={t('marketplace.home.subbanner.3.heading')}
				subheading={t.rich('marketplace.home.subbanner.3.text', {
					value: Math.round(Math.random() * 100),
					mark: (chunks) => <Mark className={classes.highlight}>{chunks}</Mark>,
				})}
				component={Link}
				href=""
				className={classes.root}
			/>
		</>
	);
}
