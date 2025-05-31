'use client';

import { MyPaginatedWinningBidsContext } from 'contexts/MyPaginatedWinningBids';
import { PaginatedBidsContext } from 'contexts/PaginatedBids';
import { PaginatedWinningBidsContext } from 'contexts/PaginatedWinningBids';
import { useContext } from 'react';

import { BidsTable } from '@/components/BidsTable';
import { AuctionDetailsPageContext } from '@/pages/marketplace/auction/[auctionId]/(details)/_components/Providers';
import { Drawer, Group, Tabs, TabsList, TabsPanel, TabsTab, Text, Title } from '@mantine/core';

import classes from './styles.module.css';

export default function Bids() {
	const paginatedBids = useContext(PaginatedBidsContext);
	const winningBids = useContext(PaginatedWinningBidsContext);
	const myWinningBids = useContext(MyPaginatedWinningBidsContext);
	const { isBidsDrawerOpen, closeBidsDrawer } = useContext(AuctionDetailsPageContext);

	return (
		<Drawer
			classNames={{ content: classes.root }}
			opened={isBidsDrawerOpen}
			onClose={closeBidsDrawer}
			withCloseButton={false}
		>
			<Group className={classes.header}>
				<Group className={classes.left}>
					<Title order={2} className={classes.title}>
						Bids Table
					</Title>
					<Text className={classes.subtitle}>
						Showing {paginatedBids.perPage}{' '}
						{paginatedBids.data.isExact ? 'of' : 'of about'}{' '}
						{paginatedBids.data.totalCount} bids
					</Text>
				</Group>
			</Group>
			<Tabs defaultValue={'winning'}>
				<TabsList>
					<TabsTab value="winning">Current Winning Bids</TabsTab>
					<TabsTab value="mine">Your Submitted Bids</TabsTab>
				</TabsList>

				<TabsPanel value="winning">
					<BidsTable
						tableData={winningBids.data.results}
						paginationType="offset"
						page={winningBids.page}
						pageCount={winningBids.data.pageCount}
						setPage={winningBids.setPage}
					/>
				</TabsPanel>

				<TabsPanel value="mine">
					<BidsTable
						tableData={myWinningBids.data.results}
						winningBidIds={winningBids.data.results.map((bid) => bid.id)}
						paginationType="offset"
						page={myWinningBids.page}
						pageCount={myWinningBids.data.pageCount}
						setPage={myWinningBids.setPage}
					/>
				</TabsPanel>
			</Tabs>
		</Drawer>
	);
}
