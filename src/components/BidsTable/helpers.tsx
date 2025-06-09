import { ReactElement } from 'react';

import { BidsTableRow } from '@/components/BidsTable/Row';
import { BidsFilter } from '@/components/BidsTable/types';
import {
	IAllWinningBidsContext,
	IMyOpenAuctionResultsContext,
	IMyPaginatedBidsContext,
	IPaginatedBidsContext,
	IPaginatedWinningBidsContext,
} from '@/contexts';
import { IUserData } from '@/schema/models';
import { Container, Group, Text } from '@mantine/core';

import classes from './styles.module.css';

interface GenerateBidsRowsParams {
	bids: IPaginatedBidsContext;
	allWinningBids?: IAllWinningBidsContext;
	paginatedWinningBids?: IPaginatedWinningBidsContext;
	myPaginatedBids?: IMyPaginatedBidsContext;
	myOpenAuctionResults?: IMyOpenAuctionResultsContext;
	bidsFilter: BidsFilter;
	currentUser: IUserData;
}
export const generateBidsRows = ({
	bids,
	allWinningBids,
	paginatedWinningBids,
	myPaginatedBids,
	myOpenAuctionResults,
	bidsFilter,
	currentUser,
}: GenerateBidsRowsParams): Array<ReactElement> => {
	const contributingBidIds =
		myOpenAuctionResults?.data.contributingLosingBids.map(({ id }) => id) || [];
	const winningBidIds = allWinningBids?.data.results.map(({ id }) => id) || [];
	switch (bidsFilter) {
		case 'all':
			return bids.data.results.map((bid) => {
				const { id, bidder } = bid;

				const highlight: Array<string> = [];
				if (bidder.id === currentUser.id) highlight.push('mine');
				if (contributingBidIds.includes(id)) highlight.push('contributing');
				if (winningBidIds.includes(id)) highlight.push('winning');

				return <BidsTableRow bid={bid} key={id} highlight={highlight} />;
			});
		case 'winning':
			if (!paginatedWinningBids) return [];
			return paginatedWinningBids.data.results.map((bid) => {
				const { id, bidder } = bid;

				const highlight: Array<string> = [];
				if (bidder.id === currentUser.id) highlight.push('mine');

				return <BidsTableRow bid={bid} key={id} highlight={highlight} />;
			});
		case 'mine':
			if (!myPaginatedBids) return [];
			return myPaginatedBids.data.results.map((bid) => {
				const { id } = bid;

				const highlight: Array<string> = [];
				if (contributingBidIds.includes(id)) highlight.push('contributing');
				if (winningBidIds.includes(id)) highlight.push('winning');

				return <BidsTableRow bid={bid} key={id} highlight={highlight} />;
			});
		default:
			return [];
	}
};

export const generateLegend = (bidsFilter: BidsFilter) => {
	switch (bidsFilter) {
		case 'all':
			return (
				<>
					<Group className={classes.cell}>
						<Container className={`${classes.key} ${classes.mine}`} />
						<Text className={classes.value}>Your Bids</Text>
					</Group>
					<Group className={classes.cell}>
						<Container className={`${classes.key} ${classes.contributing}`} />
						<Text className={classes.value}>Contributing Bids</Text>
					</Group>
					<Group className={classes.cell}>
						<Container className={`${classes.key} ${classes.winning}`} />
						<Text className={classes.value}>Winning Bids</Text>
					</Group>
				</>
			);
		case 'winning':
			return (
				<Group className={classes.cell}>
					<Container className={`${classes.key} ${classes.mine}`} />
					<Text className={classes.value}>Your Bids</Text>
				</Group>
			);
		case 'mine':
			return (
				<>
					<Group className={classes.cell}>
						<Container className={`${classes.key} ${classes.contributing}`} />
						<Text className={classes.value}>Contributing Bids</Text>
					</Group>
					<Group className={classes.cell}>
						<Container className={`${classes.key} ${classes.winning}`} />
						<Text className={classes.value}>Winning Bids</Text>
					</Group>
				</>
			);
		default:
			return null;
	}
};
