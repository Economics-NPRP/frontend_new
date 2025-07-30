import { useTranslations } from 'next-intl';
import Link from 'next/link';

import classes from '@/pages/(auth)/(external)/styles.module.css';
import { HeaderButton } from '@/pages/marketplace/_components/MarketplaceHeader/HeaderButton';
import { Button, Group, Tooltip } from '@mantine/core';
import { IconBox } from '@tabler/icons-react';

export const Header = () => {
	const t = useTranslations();

	return (
		<Group className={classes.header}>
			<Tooltip label={'Return to Login Page'}>
				<Button
					component={Link}
					href="/login"
					aria-label={'Return to Login Page'}
					classNames={{
						root: classes.logo,
						label: classes.label,
					}}
					variant="transparent"
					size="xs"
					leftSection={<IconBox size={20} />}
				>
					{t('constants.website.name.short')}
				</Button>
			</Tooltip>
			<Group className={classes.action}>
				<HeaderButton variant="language" />
				<HeaderButton variant="theme" />
			</Group>
		</Group>
	);
};
