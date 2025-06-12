import { useContext } from 'react';

import { BidsTable } from '@/components/BidsTable';
import {
	AllWinningBidsContext,
	MyPaginatedBidsContext,
	PaginatedBidsContext,
	PaginatedWinningBidsContext,
} from '@/contexts';
import { useAuctionAvailability } from '@/hooks';
import { AuctionDetailsPageContext } from '@/pages/marketplace/auction/[auctionId]/(details)/_components/Providers';
import { Alert, Divider, Group, Stack, Text, Tooltip } from '@mantine/core';
import { IconExclamationCircle, IconInfoCircle } from '@tabler/icons-react';

import classes from './styles.module.css';

export const Bids = () => {
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
						<Text className={classes.label}>Bids Table</Text>
						<Tooltip
							position="top"
							label="View all bids placed on this auction, including your own and the winning bids"
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
			{!areBidsAvailable && (
				<Alert
					variant="light"
					color="gray"
					title="Bids are currently unavailable"
					icon={<IconExclamationCircle />}
				>
					The list of bids submitted are not available during a sealed auction. Please
					wait until the auction ends and the results are published.
				</Alert>
			)}
			{areBidsAvailable && (
				<BidsTable
					bids={paginatedBids}
					allWinningBids={allWinningBids}
					paginatedWinningBids={paginatedWinningBids}
					myPaginatedBids={myPaginatedBids}
					showContributingBids={hasEnded}
					className={classes.table}
					onViewAll={openBidsDrawer}
					hideHeader
					withViewAllButton
				/>
			)}
		</Stack>
	);
};
