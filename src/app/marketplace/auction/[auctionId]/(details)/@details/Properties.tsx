import { DateTime } from 'luxon';
import { useFormatter } from 'next-intl';
import { useContext, useState } from 'react';

import { Switch } from '@/components/SwitchCase';
import { WithSkeleton } from '@/components/WithSkeleton';
import { PaginatedBidsContext, SingleAuctionContext } from '@/contexts';
import { useAuctionAvailability } from '@/hooks';
import { Button, Divider, Group, Stack, Text } from '@mantine/core';
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

	const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
	const { areBidsAvailable } = useAuctionAvailability();

	return (
		<Stack className={`${classes.properties} ${classes.section}`}>
			<Divider
				label="Details"
				classNames={{
					root: classes.divider,
					label: classes.label,
				}}
			/>
			<Stack className={classes.table}>
				<Group className={classes.row}>
					{/* <Group className={classes.cell}>
							<IconLicense size={16} className={classes.icon} />
							<Text className={classes.key}>Permits Offered</Text>
							<Text className={classes.value}>
								{format.number(auction.data.permits)} permits
							</Text>
						</Group> */}
					<Group className={classes.cell}>
						<IconHourglassEmpty size={16} className={classes.icon} />
						<Text className={classes.key}>Permit Lifespan</Text>
						<WithSkeleton loading={auction.isLoading} width={120} height={24}>
							<Text className={classes.value}>1 year</Text>
						</WithSkeleton>
					</Group>
					<Group className={classes.cell}>
						<IconLeaf size={16} className={classes.icon} />
						<Text className={classes.key}>Emissions Per Permit</Text>
						<WithSkeleton loading={auction.isLoading} width={120} height={24}>
							<Text className={classes.value}>10,000 tCO2e</Text>
						</WithSkeleton>
					</Group>
				</Group>
				{/* <Group className={classes.row}>
						<Group className={classes.cell}>
							<IconHourglassEmpty size={16} className={classes.icon} />
							<Text className={classes.key}>Permit Lifespan</Text>
							<Text className={classes.value}>1 year</Text>
						</Group>
						<Group className={classes.cell}>
							<IconDiamond size={16} className={classes.icon} />
							<Text className={classes.key}>Emission Quality</Text>
							<Text className={classes.value}>High Quality</Text>
						</Group>
					</Group> */}
				<Group className={classes.row}>
					<Group className={classes.cell}>
						<IconClock size={16} className={classes.icon} />
						<Text className={classes.key}>Auction Start Date</Text>
						<WithSkeleton loading={auction.isLoading} width={120} height={24}>
							<Text className={classes.value}>
								{DateTime.fromISO(auction.data.startDatetime).toLocaleString(
									DateTime.DATETIME_SHORT,
								)}
							</Text>
						</WithSkeleton>
					</Group>
					<Group className={classes.cell}>
						<IconAlarm size={16} className={classes.icon} />
						<Text className={classes.key}>Auction End Date</Text>
						<WithSkeleton loading={auction.isLoading} width={120} height={24}>
							<Text className={classes.value}>
								{DateTime.fromISO(auction.data.endDatetime).toLocaleString(
									DateTime.DATETIME_SHORT,
								)}
							</Text>
						</WithSkeleton>
					</Group>
				</Group>
				<Switch value={isDetailsExpanded}>
					<Switch.False>
						<Button
							className={classes.subtle}
							variant="subtle"
							onClick={() => setIsDetailsExpanded(true)}
						>
							Show More
						</Button>
					</Switch.False>
					<Switch.True>
						<Group className={classes.row}>
							<Group className={classes.cell}>
								<IconEye size={16} className={classes.icon} />
								<Text className={classes.key}>Number of Views</Text>
								<WithSkeleton loading={auction.isLoading} width={120} height={24}>
									<Text className={classes.value}>{format.number(0)} views</Text>
								</WithSkeleton>
							</Group>
							<Group className={classes.cell}>
								<IconBuildingBank size={16} className={classes.icon} />
								<Text className={classes.key}>Number of Bidders</Text>
								<WithSkeleton loading={auction.isLoading} width={120} height={24}>
									<Text className={classes.value}>
										{format.number(0)} bidders
									</Text>
								</WithSkeleton>
							</Group>
						</Group>
						<Group className={classes.row}>
							<Group className={classes.cell}>
								<IconGavel size={16} className={classes.icon} />
								<Text className={classes.key}>Number of Bids</Text>
								<WithSkeleton
									loading={paginatedBids.isLoading}
									width={120}
									height={24}
								>
									<Text className={classes.value}>
										{areBidsAvailable
											? `${format.number(paginatedBids.data.totalCount)} bids`
											: 'N/A'}
									</Text>
								</WithSkeleton>
							</Group>
							<Group className={classes.cell}>
								<IconBookmark size={16} className={classes.icon} />
								<Text className={classes.key}>Number of Bookmarks</Text>
								<WithSkeleton loading={auction.isLoading} width={120} height={24}>
									<Text className={classes.value}>
										{format.number(0)} bookmarks
									</Text>
								</WithSkeleton>
							</Group>
						</Group>
						<Button
							className={classes.subtle}
							variant="subtle"
							onClick={() => setIsDetailsExpanded(false)}
						>
							Show Less
						</Button>
					</Switch.True>
				</Switch>
			</Stack>
		</Stack>
	);
};
