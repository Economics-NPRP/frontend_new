import { useTranslations } from 'next-intl';
import { useContext } from 'react';

import { BidsTable } from '@/components/Tables/Bids';
import {
	AllWinningBidsContext,
	MyPaginatedBidsContext,
	PaginatedBidsContext,
	PaginatedWinningBidsContext,
	SingleAuctionContext,
} from '@/contexts';
import { useAuctionAvailability } from '@/hooks';
import { AuctionDetailsPageContext } from '@/pages/marketplace/auction/[auctionId]/(details)/_components/Providers';
import { Divider, Group, Stack, Text, Tooltip } from '@mantine/core';
import { IconInfoCircle } from '@tabler/icons-react';

import classes from './styles.module.css';

export const Bids = () => {
	const t = useTranslations();
	const auction = useContext(SingleAuctionContext);
	const paginatedBids = useContext(PaginatedBidsContext);
	const allWinningBids = useContext(AllWinningBidsContext);
	const paginatedWinningBids = useContext(PaginatedWinningBidsContext);
	const myPaginatedBids = useContext(MyPaginatedBidsContext);
	const { openBidsDrawer } = useContext(AuctionDetailsPageContext);

	const { hasEnded, areBidsAvailable } = useAuctionAvailability();

	return (
		<Stack className={`${classes.bids} ${classes.section}`}>
			<Divider
				label={
					<Group className={classes.row}>
						<Text className={classes.label}>
							{t('marketplace.auction.details.details.bids.title')}
						</Text>
						<Tooltip
							position="top"
							label={t('marketplace.auction.details.details.bids.info')}
						>
							<IconInfoCircle size={14} className={classes.info} />
						</Tooltip>
					</Group>
				}
				classNames={{
					root: classes.divider,
					label: classes.label,
				}}
			/>
			<BidsTable
				bids={paginatedBids}
				allWinningBids={allWinningBids}
				paginatedWinningBids={paginatedWinningBids}
				myPaginatedBids={myPaginatedBids}
				showContributingBids={hasEnded}
				className={classes.table}
				tableClassName={classes.inner}
				onViewAll={openBidsDrawer}
				loading={
					auction.isLoading ||
					paginatedBids.isLoading ||
					allWinningBids.isLoading ||
					paginatedWinningBids.isLoading ||
					myPaginatedBids.isLoading
				}
				unavailable={auction.isSuccess && !areBidsAvailable}
				hideHeader
				withViewAllButton
			/>
		</Stack>
	);
};
