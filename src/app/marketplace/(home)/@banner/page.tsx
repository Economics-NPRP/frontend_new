import { DateTime } from 'luxon';
import { useTranslations } from 'next-intl';
import { use } from 'react';

import { Countdown } from '@/components/Countdown';
import { getUserLocale } from '@/locales';
import { ActionIcon, Button, ButtonGroup, Container, Text, Title, Tooltip } from '@mantine/core';
import { IconArrowUpRight, IconCalendarSearch } from '@tabler/icons-react';

import classes from './styles.module.css';

export default function Banner() {
	const t = useTranslations();
	const locale = use(getUserLocale());

	const date = DateTime.fromObject({ year: 2024, month: 12, day: 27 }).setLocale(locale);

	return (
		<Container className={`${classes.root} bg-stagger-md`}>
			<Container className={classes.bg}>
				<Container className={classes.gradient} />
				<Container className={classes.gradient} />
			</Container>

			<Text className={classes.subheading}>{t('marketplace.home.banner.subtitle')}</Text>
			<Title className={classes.heading} order={1}>
				{t('marketplace.home.banner.title')}
			</Title>
			<Text className={classes.date}>
				{t('marketplace.home.banner.start-date')}{' '}
				{date.toLocaleString(DateTime.DATETIME_FULL)}
			</Text>

			<Countdown className={classes.countdown} targetDate={date.toISO()!} />

			<ButtonGroup className={classes.actions}>
				<Tooltip label={t('marketplace.home.banner.actions.calendar.tooltip')}>
					<ActionIcon className={classes.secondary} variant="outline">
						<IconCalendarSearch size={16} />
					</ActionIcon>
				</Tooltip>
				<Tooltip label={t('marketplace.home.banner.actions.explore.tooltip')}>
					<Button
						className={classes.primary}
						rightSection={<IconArrowUpRight size={16} />}
					>
						{t('marketplace.home.banner.actions.explore.text')}
					</Button>
				</Tooltip>
			</ButtonGroup>
		</Container>
	);
}
