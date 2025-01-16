import { AuctionCard } from '@/components/AuctionCard';
import { IAuctionData } from '@/schema/models';
import { Container, Pagination } from '@mantine/core';

import classes from './styles.module.css';

const defaultAuctionData: IAuctionData = {
	id: 'a446b04a-d525-4398-9171-7b3e107375cb',
	ownerId: 'd5b98537-e942-4810-8840-898aed77ec18',
	type: 'open',
	isPrimaryMarket: true,
	title: 'Auction 36',
	image: null,
	description: '',
	permits: 230,
	minBid: 175,
	bids: 0,
	views: 0,
	bookmarks: 0,
	isVisible: true,
	createdAt: '2025-01-06T18:35:20.312591Z',
	startDatetime: '2025-01-09T18:35:20.315584Z',
	endDatetime: '2025-01-10T18:35:20.315584Z',
	owner: {
		id: 'd5b98537-e942-4810-8840-898aed77ec18',
		type: 'admin',
		name: 'super_admin',
		email: 'elite0192@gmail.com',
		phone: '12345678',
		image: null,
		emailVerified: false,
		phoneVerified: false,
		isActive: true,
		createdAt: '2025-01-06T18:35:17.498733Z',
	},
	hasJoined: false,
};

export const List = () => {
	return (
		<Container className={classes.catalogue}>
			<Pagination className={classes.pagination} total={100} siblings={2} boundaries={3} />
			<AuctionCard auction={defaultAuctionData} />
			<AuctionCard auction={defaultAuctionData} />
			<AuctionCard auction={defaultAuctionData} />
			<AuctionCard auction={defaultAuctionData} />
			<AuctionCard auction={defaultAuctionData} />
			<AuctionCard auction={defaultAuctionData} />
			<AuctionCard auction={defaultAuctionData} />
			<AuctionCard auction={defaultAuctionData} />
			<AuctionCard auction={defaultAuctionData} />
			<AuctionCard auction={defaultAuctionData} />
			<AuctionCard auction={defaultAuctionData} />
			<AuctionCard auction={defaultAuctionData} />
			<Pagination className={classes.pagination} total={100} siblings={2} boundaries={3} />
		</Container>
	);
};
