'use client';

import { MyPaginatedBidsContext } from 'contexts/MyPaginatedBids';
import { PaginatedBidsContext } from 'contexts/PaginatedBids';
import { PaginatedWinningBidsContext } from 'contexts/PaginatedWinningBids';
import { useContext } from 'react';

import { BidsTable } from '@/components/BidsTable';
import { AuctionDetailsPageContext } from '@/pages/marketplace/auction/[auctionId]/(details)/_components/Providers';
import { Drawer } from '@mantine/core';

import classes from './styles.module.css';

export default function Bids() {
	const paginatedBids = useContext(PaginatedBidsContext);
	const winningBids = useContext(PaginatedWinningBidsContext);
	const myPaginatedBids = useContext(MyPaginatedBidsContext);
	const { isBidsDrawerOpen, closeBidsDrawer } = useContext(AuctionDetailsPageContext);

	return (
		<Drawer
			classNames={{ content: classes.root, body: classes.body }}
			opened={isBidsDrawerOpen}
			onClose={closeBidsDrawer}
			withCloseButton={false}
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
	);
}
