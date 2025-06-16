'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useContext } from 'react';

import { BidsTable } from '@/components/BidsTable';
import {
	AllWinningBidsContext,
	MyPaginatedBidsContext,
	PaginatedBidsContext,
	PaginatedWinningBidsContext,
	RealtimeBidsContext,
	SingleAuctionContext,
} from '@/contexts';
import { useAuctionAvailability } from '@/hooks';
import { AuctionDetailsPageContext } from '@/pages/marketplace/auction/[auctionId]/(details)/_components/Providers';
import { ActionIcon, Drawer, Indicator, Tooltip } from '@mantine/core';
import { IconListDetails } from '@tabler/icons-react';

import classes from './styles.module.css';

export default function Bids() {
	const t = useTranslations();
	const auction = useContext(SingleAuctionContext);
	const paginatedBids = useContext(PaginatedBidsContext);
	const allWinningBids = useContext(AllWinningBidsContext);
	const paginatedWinningBids = useContext(PaginatedWinningBidsContext);
	const myPaginatedBids = useContext(MyPaginatedBidsContext);
	const realtimeBids = useContext(RealtimeBidsContext);
	const { isBidsDrawerOpen, openBidsDrawer, closeBidsDrawer } =
		useContext(AuctionDetailsPageContext);

	const { hasEnded, areBidsAvailable } = useAuctionAvailability();

	const handleOpenDrawer = useCallback(() => {
		realtimeBids.setStatus('idle');
		openBidsDrawer();
	}, [realtimeBids, openBidsDrawer]);

	return (
		<>
			<Drawer
				classNames={{ content: classes.root, body: classes.body }}
				opened={isBidsDrawerOpen}
				onClose={closeBidsDrawer}
				withCloseButton={false}
				keepMounted
			>
				<BidsTable
					bids={paginatedBids}
					allWinningBids={allWinningBids}
					paginatedWinningBids={paginatedWinningBids}
					myPaginatedBids={myPaginatedBids}
					showContributingBids={hasEnded}
					className={classes.table}
					loading={
						auction.isLoading ||
						paginatedBids.isLoading ||
						allWinningBids.isLoading ||
						paginatedWinningBids.isLoading ||
						myPaginatedBids.isLoading
					}
					unavailable={auction.isSuccess && !areBidsAvailable}
					onClose={closeBidsDrawer}
					withCloseButton
				/>
			</Drawer>
			<Tooltip
				label={t('marketplace.auction.details.bidsDrawer.button.tooltip')}
				position="right"
			>
				<Indicator
					className={classes.indicator}
					size={8}
					color="red"
					disabled={realtimeBids.status !== 'new'}
					processing
				>
					<ActionIcon className={classes.button} onClick={handleOpenDrawer}>
						<IconListDetails size={20} />
					</ActionIcon>
				</Indicator>
			</Tooltip>
		</>
	);
}
