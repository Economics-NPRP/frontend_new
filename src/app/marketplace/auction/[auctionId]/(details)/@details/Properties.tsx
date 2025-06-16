import { DateTime } from 'luxon';
import { useTranslations } from 'next-intl';
import { useContext } from 'react';

import { WithSkeleton } from '@/components/WithSkeleton';
import { SingleAuctionContext } from '@/contexts';
import { useAuctionAvailability } from '@/hooks';
import { Divider, Group, Stack, Text } from '@mantine/core';
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
		<Stack className={`${classes.properties} ${classes.section}`}>
			<Divider
				label={t('marketplace.auction.details.details.properties.title')}
				classNames={{
					root: classes.divider,
					label: classes.label,
				}}
			/>
			<Stack className={classes.table}>
				<Group className={classes.row}>
					<Group className={classes.cell}>
						<IconHourglassEmpty size={16} className={classes.icon} />
						<Text className={classes.key}>
							{t('marketplace.auction.details.details.properties.permitLifespan.key')}
						</Text>
						<WithSkeleton loading={auction.isLoading} width={120} height={24}>
							<Text className={classes.value}>
								{t('constants.quantities.years.default', { value: 1 })}
							</Text>
						</WithSkeleton>
					</Group>
					<Group className={classes.cell}>
						<IconLeaf size={16} className={classes.icon} />
						<Text className={classes.key}>
							{t(
								'marketplace.auction.details.details.properties.emissionsPerPermit.key',
							)}
						</Text>
						<WithSkeleton loading={auction.isLoading} width={120} height={24}>
							<Text className={classes.value}>
								{t('constants.quantities.emissions.default', { value: 10000 })}
							</Text>
						</WithSkeleton>
					</Group>
				</Group>
				<Group className={classes.row}>
					<Group className={classes.cell}>
						<IconClock size={16} className={classes.icon} />
						<Text className={classes.key}>
							{t('marketplace.auction.details.details.properties.startDate.key')}
						</Text>
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
						<Text className={classes.key}>
							{t('marketplace.auction.details.details.properties.endDate.key')}
						</Text>
						<WithSkeleton loading={auction.isLoading} width={120} height={24}>
							<Text className={classes.value}>
								{DateTime.fromISO(auction.data.endDatetime).toLocaleString(
									DateTime.DATETIME_SHORT,
								)}
							</Text>
						</WithSkeleton>
					</Group>
				</Group>
				<Group className={classes.row}>
					<Group className={classes.cell}>
						<IconEye size={16} className={classes.icon} />
						<Text className={classes.key}>
							{t('marketplace.auction.details.details.properties.views.key')}
						</Text>
						<WithSkeleton loading={auction.isLoading} width={120} height={24}>
							<Text className={classes.value}>
								{t('constants.quantities.views.default', { value: 0 })}
							</Text>
						</WithSkeleton>
					</Group>
					<Group className={classes.cell}>
						<IconBuildingBank size={16} className={classes.icon} />
						<Text className={classes.key}>
							{t('marketplace.auction.details.details.properties.bidders.key')}
						</Text>
						<WithSkeleton loading={auction.isLoading} width={120} height={24}>
							<Text className={classes.value}>
								{t('constants.quantities.bidders.default', { value: 0 })}
							</Text>
						</WithSkeleton>
					</Group>
				</Group>
				<Group className={classes.row}>
					<Group className={classes.cell}>
						<IconGavel size={16} className={classes.icon} />
						<Text className={classes.key}>
							{t('marketplace.auction.details.details.properties.bids.key')}
						</Text>
						<WithSkeleton loading={auction.isLoading} width={120} height={24}>
							<Text className={classes.value}>
								{areBidsAvailable
									? t('constants.quantities.bids.default', { value: 0 })
									: 'N/A'}
							</Text>
						</WithSkeleton>
					</Group>
					<Group className={classes.cell}>
						<IconBookmark size={16} className={classes.icon} />
						<Text className={classes.key}>
							{t('marketplace.auction.details.details.properties.bookmarks.key')}
						</Text>
						<WithSkeleton loading={auction.isLoading} width={120} height={24}>
							<Text className={classes.value}>
								{t('constants.quantities.bookmarks.default', { value: 0 })}
							</Text>
						</WithSkeleton>
					</Group>
				</Group>
			</Stack>
		</Stack>
	);
};
