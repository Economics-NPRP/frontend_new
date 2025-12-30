'use client'
import { DateTime } from 'luxon';
import { useLocale, useTranslations } from 'next-intl';

import { LargeCountdown } from '@/components/Countdown';
import { ActionIcon, Button, ButtonGroup, Container, Text, Title, Tooltip, Anchor } from '@mantine/core';
import { IconCalendarSearch, IconArrowDown } from '@tabler/icons-react';
import { InfoText } from './_components/InfoText';

import classes from './styles.module.css';
import { useQueryState } from 'nuqs';
import { useContext, useEffect } from 'react';
import { MyUserProfileContext } from 'contexts/MyUserProfile';

export default function Banner() {
	const t = useTranslations();
	const locale = useLocale();
	const userInfo = useContext(MyUserProfileContext)

	useEffect(() => {
		console.log(userInfo.data)
	}, [userInfo])
	
	const [ownership, _] = useQueryState('ownership');

	const date = DateTime.fromObject({ year: 2025, month: 11, day: 6, hour: 15, minute: 30 }).setLocale(locale);

	return (
		<Container className={`${classes.root} bg-stagger-md`}>
			<Container className={classes.bg}>
				<Container className={classes.gradient + ' ' + classes[ownership || 'government']} />
				<Container className={classes.gradient + ' ' + classes[ownership || 'government']} />
				<Container className={classes.gradient + ' ' + classes[ownership || 'government']} />
			</Container>

			<Text className={classes.subheading}>{t(ownership === 'private' ? 'marketplace.home.banner.subtitle.private' : 'marketplace.home.banner.subtitle.government')}</Text>
			<Title className={classes.heading} order={1}>
				{t(`marketplace.home.banner.title.${ownership === 'private' ? 'private' : date > DateTime.now() ? 'government' : 'ongoing'}`)}
			</Title>
			<Text className={classes.date}>
				{
					Date.now() < date.toMillis() && ownership !== 'private' ?
						t('marketplace.home.banner.startDate') + ' ' +
						date.toLocaleString(DateTime.DATETIME_FULL)
					: ownership === 'private' ?
						t('marketplace.home.banner.privateDescription')
					: t('marketplace.home.banner.governmentDescription')
				}
			</Text>

			{
				ownership === 'private' ?
					<InfoText
						text={t('marketplace.home.banner.excessPermits', {
							permits: userInfo && userInfo.data && userInfo.data.permits ? userInfo.data.permits.length : "-"
						})}
						loading={userInfo.isLoading}
					/>
					:
					ownership !== 'private' && Date.now() >= date.toMillis() ? 
					<InfoText
						text={t('marketplace.home.banner.ongoing')}
					/>
					:
				<LargeCountdown className={classes.countdown} targetDate={date.toISO()!} />
			}

			<ButtonGroup className={classes.actions}>
				<Tooltip label={t('marketplace.home.banner.actions.calendar.tooltip')}>
					<ActionIcon className={classes.secondary} variant="outline">
						<IconCalendarSearch size={16} />
					</ActionIcon>
				</Tooltip>
				<Tooltip label={t('marketplace.home.banner.actions.explore.tooltip')}>
					<Anchor href="#marketplace-catalogue">
						<Button
							className={classes.primary}
							rightSection={<IconArrowDown size={16} />}
						>
							{t('marketplace.home.banner.actions.explore.text')}
						</Button>
					</Anchor>
				</Tooltip>
			</ButtonGroup>
		</Container>
	);
}
