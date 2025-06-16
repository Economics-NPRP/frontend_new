import { DateTime } from 'luxon';
import { useTranslations } from 'next-intl';
import { useContext } from 'react';

import { LargeCountdown } from '@/components/Countdown';
import { SingleAuctionContext } from '@/contexts';
import { Stack, Text, Title } from '@mantine/core';

import classes from './styles.module.css';

export const Ongoing = () => {
	const t = useTranslations();
	const auction = useContext(SingleAuctionContext);

	return (
		<Stack className={`${classes.ongoing} ${classes.ticket}`}>
			<Stack className={classes.header}>
				<Title order={2} className={classes.title}>
					{t('marketplace.auction.results.ticket.ongoing.title')}
				</Title>
				<Text className={classes.subtitle}>
					{t('marketplace.auction.results.ticket.ongoing.subtitle')}
				</Text>
			</Stack>
			<Stack className={classes.countdown}>
				<Text className={classes.title}>{t('constants.auctionStatus.endingIn.label')}</Text>
				<LargeCountdown targetDate={auction.data.endDatetime} />
				<Text className={classes.subtext}>
					{DateTime.fromISO(auction.data.endDatetime).toLocaleString(
						DateTime.DATETIME_FULL,
					)}
				</Text>
			</Stack>
		</Stack>
	);
};
