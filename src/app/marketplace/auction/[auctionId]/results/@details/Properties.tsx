import { DateTime } from 'luxon';
import { useTranslations } from 'next-intl';
import { useContext } from 'react';

import { WithSkeleton } from '@/components/WithSkeleton';
import { SingleAuctionContext } from '@/contexts';
import { useAuctionAvailability } from '@/hooks';
import { Container, Group, Stack, Text } from '@mantine/core';
import {
	IconAlarm,
	IconBookmark,
	IconBuildingBank,
	IconClock,
	IconEye,
	IconGavel,
	IconHourglassEmpty,
	IconLeaf,
} from '@tabler/icons-react';

import classes from './styles.module.css';

export const Properties = () => {
	const t = useTranslations();
	const auction = useContext(SingleAuctionContext);

	const { areBidsAvailable } = useAuctionAvailability();

	return (
		<Group className={classes.properties}>
			<Stack className={classes.cell}>
				<Container className={classes.icon}>
					<IconHourglassEmpty size={20} />
				</Container>
				<Text className={classes.key}>
					{t('marketplace.auction.details.details.properties.permitLifespan.key')}
				</Text>
				<WithSkeleton width={40} height={20} loading={auction.isLoading} data-dark>
					<Text className={classes.value}>
						{t('constants.quantities.years.default', { value: 1 })}
					</Text>
				</WithSkeleton>
			</Stack>
			<Stack className={classes.cell}>
				<Container className={classes.icon}>
					<IconLeaf size={20} />
				</Container>
				<Text className={classes.key}>
					{t('marketplace.auction.details.details.properties.emissionsPerPermit.key')}
				</Text>
				<WithSkeleton width={80} height={20} loading={auction.isLoading} data-dark>
					<Text className={classes.value}>
						{t('constants.quantities.emissions.default', { value: 10000 })}
					</Text>
				</WithSkeleton>
			</Stack>
			<Stack className={classes.cell}>
				<Container className={classes.icon}>
					<IconClock size={16} />
				</Container>
				<Text className={classes.key}>
					{t('marketplace.auction.details.details.properties.startDate.key')}
				</Text>
				<WithSkeleton width={100} height={20} loading={auction.isLoading} data-dark>
					<Text className={classes.value}>
						{DateTime.fromISO(auction.data.startDatetime).toLocaleString(
							DateTime.DATETIME_SHORT,
						)}
					</Text>
				</WithSkeleton>
			</Stack>
			<Stack className={classes.cell}>
				<Container className={classes.icon}>
					<IconAlarm size={16} />
				</Container>
				<Text className={classes.key}>
					{t('marketplace.auction.details.details.properties.endDate.key')}
				</Text>
				<WithSkeleton width={100} height={20} loading={auction.isLoading} data-dark>
					<Text className={classes.value}>
						{DateTime.fromISO(auction.data.endDatetime).toLocaleString(
							DateTime.DATETIME_SHORT,
						)}
					</Text>
				</WithSkeleton>
			</Stack>
			<Stack className={classes.cell}>
				<Container className={classes.icon}>
					<IconEye size={16} />
				</Container>
				<Text className={classes.key}>
					{t('marketplace.auction.details.details.properties.views.key')}
				</Text>
				<WithSkeleton width={64} height={20} loading={auction.isLoading} data-dark>
					<Text className={classes.value}>
						{t('constants.quantities.views.default', { value: 0 })}
					</Text>
				</WithSkeleton>
			</Stack>
			<Stack className={classes.cell}>
				<Container className={classes.icon}>
					<IconBuildingBank size={16} />
				</Container>
				<Text className={classes.key}>
					{t('marketplace.auction.details.details.properties.bidders.key')}
				</Text>
				<WithSkeleton width={64} height={20} loading={auction.isLoading} data-dark>
					<Text className={classes.value}>
						{t('constants.quantities.bidders.default', {
							value: auction.data.biddersCount,
						})}
					</Text>
				</WithSkeleton>
			</Stack>
			<Stack className={classes.cell}>
				<Container className={classes.icon}>
					<IconGavel size={16} />
				</Container>
				<Text className={classes.key}>
					{t('marketplace.auction.details.details.properties.bids.key')}
				</Text>
				<WithSkeleton width={64} height={20} loading={auction.isLoading} data-dark>
					<Text className={classes.value}>
						{areBidsAvailable
							? t('constants.quantities.bids.default', {
									value: auction.data.bidsCount,
								})
							: 'N/A'}
					</Text>
				</WithSkeleton>
			</Stack>
			<Stack className={classes.cell}>
				<Container className={classes.icon}>
					<IconBookmark size={16} />
				</Container>
				<Text className={classes.key}>
					{t('marketplace.auction.details.details.properties.bookmarks.key')}
				</Text>
				<WithSkeleton width={64} height={20} loading={auction.isLoading} data-dark>
					<Text className={classes.value}>
						{t('constants.quantities.bookmarks.default', { value: 0 })}
					</Text>
				</WithSkeleton>
			</Stack>
		</Group>
	);
};
