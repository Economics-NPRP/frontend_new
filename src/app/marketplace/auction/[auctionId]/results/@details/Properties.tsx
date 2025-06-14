import { DateTime } from 'luxon';
import { useFormatter } from 'next-intl';
import { useContext } from 'react';

import { WithSkeleton } from '@/components/WithSkeleton';
import { PaginatedBidsContext, SingleAuctionContext } from '@/contexts';
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
	const format = useFormatter();
	const auction = useContext(SingleAuctionContext);
	const paginatedBids = useContext(PaginatedBidsContext);

	const { areBidsAvailable } = useAuctionAvailability();

	return (
		<Group className={classes.properties}>
			<Stack className={classes.cell}>
				<Container className={classes.icon}>
					<IconHourglassEmpty size={20} />
				</Container>
				<Text className={classes.key}>Permit Lifespan</Text>
				<WithSkeleton width={40} height={20} loading={auction.isLoading} data-dark>
					<Text className={classes.value}>1 year</Text>
				</WithSkeleton>
			</Stack>
			<Stack className={classes.cell}>
				<Container className={classes.icon}>
					<IconLeaf size={20} />
				</Container>
				<Text className={classes.key}>Emissions Per Permit</Text>
				<WithSkeleton width={80} height={20} loading={auction.isLoading} data-dark>
					<Text className={classes.value}>10,000 tCO2e</Text>
				</WithSkeleton>
			</Stack>
			<Stack className={classes.cell}>
				<Container className={classes.icon}>
					<IconClock size={16} />
				</Container>
				<Text className={classes.key}>Auction Start Date</Text>
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
				<Text className={classes.key}>Auction End Date</Text>
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
				<Text className={classes.key}>Number of Views</Text>
				<WithSkeleton width={64} height={20} loading={auction.isLoading} data-dark>
					<Text className={classes.value}>{format.number(0)} views</Text>
				</WithSkeleton>
			</Stack>
			<Stack className={classes.cell}>
				<Container className={classes.icon}>
					<IconBuildingBank size={16} />
				</Container>
				<Text className={classes.key}>Number of Bidders</Text>
				<WithSkeleton width={64} height={20} loading={auction.isLoading} data-dark>
					<Text className={classes.value}>{format.number(0)} bidders</Text>
				</WithSkeleton>
			</Stack>
			<Stack className={classes.cell}>
				<Container className={classes.icon}>
					<IconGavel size={16} />
				</Container>
				<Text className={classes.key}>Number of Bids</Text>
				<WithSkeleton width={64} height={20} loading={auction.isLoading} data-dark>
					<Text className={classes.value}>
						{areBidsAvailable
							? `${format.number(paginatedBids.data.totalCount)} bids`
							: 'N/A'}
					</Text>
				</WithSkeleton>
			</Stack>
			<Stack className={classes.cell}>
				<Container className={classes.icon}>
					<IconBookmark size={16} />
				</Container>
				<Text className={classes.key}>Number of Bookmarks</Text>
				<WithSkeleton width={64} height={20} loading={auction.isLoading} data-dark>
					<Text className={classes.value}>{format.number(0)} bookmarks</Text>
				</WithSkeleton>
			</Stack>
		</Group>
	);
};
