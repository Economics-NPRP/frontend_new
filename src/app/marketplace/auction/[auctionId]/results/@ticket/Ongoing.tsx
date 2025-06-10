import { DateTime } from 'luxon';
import { useContext } from 'react';

import { LargeCountdown } from '@/components/Countdown';
import { SingleAuctionContext } from '@/contexts';
import { Stack, Text, Title } from '@mantine/core';

import classes from './styles.module.css';

export const Ongoing = () => {
	const auction = useContext(SingleAuctionContext);

	return (
		<Stack className={`${classes.ongoing} ${classes.ticket}`}>
			<Stack className={classes.header}>
				<Title order={2} className={classes.title}>
					Results Not Yet Available
				</Title>
				<Text className={classes.subtitle}>
					The auction is still ongoing. Results will be available once the auction ends
					and all bids have been processed.
				</Text>
			</Stack>
			<Stack className={classes.countdown}>
				<Text className={classes.title}>Ending In</Text>
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
