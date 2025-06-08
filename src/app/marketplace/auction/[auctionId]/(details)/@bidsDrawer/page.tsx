'use client';

import { useCallback, useContext } from 'react';

import { BidsTable } from '@/components/BidsTable';
import {
	MyPaginatedBidsContext,
	PaginatedBidsContext,
	PaginatedWinningBidsContext,
	RealtimeBidsContext,
} from '@/contexts';
import { AuctionDetailsPageContext } from '@/pages/marketplace/auction/[auctionId]/(details)/_components/Providers';
import { ActionIcon, Drawer, Indicator, Tooltip } from '@mantine/core';
import { IconListDetails } from '@tabler/icons-react';

import classes from './styles.module.css';

export default function Bids() {
	const paginatedBids = useContext(PaginatedBidsContext);
	const winningBids = useContext(PaginatedWinningBidsContext);
	const myPaginatedBids = useContext(MyPaginatedBidsContext);
	const realtimeBids = useContext(RealtimeBidsContext);
	const { isBidsDrawerOpen, openBidsDrawer, closeBidsDrawer } =
		useContext(AuctionDetailsPageContext);

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
					winningBids={winningBids}
					myPaginatedBids={myPaginatedBids}
					withCloseButton
					onClose={closeBidsDrawer}
					className={classes.table}
				/>
			</Drawer>
			<Tooltip label="Open bids table" position="right">
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
