import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { Switch } from '@/components/SwitchCase';
import { Button, Stack, Text, Title } from '@mantine/core';
import { IconRosetteDiscountCheck } from '@tabler/icons-react';

import classes from './styles.module.css';

export const FinalStep = () => {
	const t = useTranslations();
	const { cycleId } = useParams();

	return (
		<Stack className={`${classes.final} ${classes.root}`}>
			<IconRosetteDiscountCheck size={64} className={classes.icon} />
			<Title className={classes.heading}>{t('create.auction.final.header.heading')}</Title>
			<Text className={classes.subheading}>
				{t('create.auction.final.header.subheading')}
			</Text>
			<Switch value={cycleId as string | undefined}>
				<Switch.Case when={undefined}>
					<Button component={Link} href="/marketplace" className={classes.button}>
						{t('constants.return.marketplace.label')}
					</Button>
				</Switch.Case>
				<Switch.Else>
					<Button
						component={Link}
						href={`/dashboard/a/cycles/${cycleId}`}
						className={classes.button}
					>
						{t('constants.return.cyclePage.label')}
					</Button>
				</Switch.Else>
			</Switch>
		</Stack>
	);
};
