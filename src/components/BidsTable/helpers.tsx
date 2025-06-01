import { BidsTableRow } from '@/components/BidsTable/Row';
import { BidsFilter } from '@/components/BidsTable/types';
import { IBidData, IUserData } from '@/schema/models';
import { KeysetPaginatedContextState, OffsetPaginatedContextState } from '@/types';
import { Container, Group, Text } from '@mantine/core';

import classes from './styles.module.css';

interface GenerateBidsRowsParams {
	bids: KeysetPaginatedContextState<IBidData>;
	winningBids?: OffsetPaginatedContextState<IBidData>;
	myPaginatedBids?: KeysetPaginatedContextState<IBidData>;
	contributingBidIds?: Array<string>;
	bidsFilter: BidsFilter;
	currentUser: IUserData;
}
export const generateBidsRows = ({
	bids,
	winningBids,
	myPaginatedBids,
	contributingBidIds,
	bidsFilter,
	currentUser,
}: GenerateBidsRowsParams) => {
	switch (bidsFilter) {
		case 'all':
			return bids.data.results.map((bid) => {
				const { id, bidder } = bid;

				let bgColor = '';
				if (contributingBidIds && contributingBidIds.includes(id)) bgColor = 'bg-blue-50';
				else if (winningBids && winningBids.data.results.map(({ id }) => id).includes(id))
					bgColor = 'bg-yellow-50';
				else if (bidder.id === currentUser.id) bgColor = 'bg-gray-50';

				return <BidsTableRow bid={bid} key={id} className={bgColor} />;
			});
		case 'winning':
			if (!winningBids) return null;
			return winningBids.data.results.map((bid) => {
				const { id, bidder } = bid;

				let bgColor = '';
				if (bidder.id === currentUser.id) bgColor = 'bg-gray-50';

				return <BidsTableRow bid={bid} key={id} className={bgColor} />;
			});
		case 'mine':
			if (!myPaginatedBids) return null;
			return myPaginatedBids.data.results.map((bid) => {
				const { id } = bid;

				let bgColor = '';
				if (contributingBidIds && contributingBidIds.includes(id)) bgColor = 'bg-blue-50';
				else if (winningBids && winningBids.data.results.map(({ id }) => id).includes(id))
					bgColor = 'bg-yellow-50';

				return <BidsTableRow bid={bid} key={id} className={bgColor} />;
			});
		default:
			return null;
	}
};

export const generateLegend = (bidsFilter: BidsFilter) => {
	switch (bidsFilter) {
		case 'all':
			return (
				<>
					<Group className={classes.cell}>
						<Container className={`${classes.key} ${classes.blue}`} />
						<Text className={classes.value}>Contributing Bids</Text>
					</Group>
					<Group className={classes.cell}>
						<Container className={`${classes.key} ${classes.yellow}`} />
						<Text className={classes.value}>Winning Bids</Text>
					</Group>
					<Group className={classes.cell}>
						<Container className={`${classes.key} ${classes.gray}`} />
						<Text className={classes.value}>Your Bids</Text>
					</Group>
				</>
			);
		case 'winning':
			return (
				<Group className={classes.cell}>
					<Container className={`${classes.key} ${classes.gray}`} />
					<Text className={classes.value}>Your Bids</Text>
				</Group>
			);
		case 'mine':
			return (
				<>
					<Group className={classes.cell}>
						<Container className={`${classes.key} ${classes.blue}`} />
						<Text className={classes.value}>Contributing Bids</Text>
					</Group>
					<Group className={classes.cell}>
						<Container className={`${classes.key} ${classes.yellow}`} />
						<Text className={classes.value}>Winning Bids</Text>
					</Group>
				</>
			);
		default:
			return null;
	}
};
