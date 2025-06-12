import { useParams } from 'next/navigation';
import { useContext } from 'react';

import { SingleAuctionContext } from '@/contexts';
import { useJoinAuction } from '@/hooks';
import { Button, Container, Stack, Text, Title } from '@mantine/core';
import { IconCheckbox } from '@tabler/icons-react';

import classes from './styles.module.css';

export const UpcomingOverlay = () => {
	const auction = useContext(SingleAuctionContext);
	const { auctionId } = useParams();

	const joinAuction = useJoinAuction(auctionId as string);

	return (
		<Stack className={classes.overlay}>
			<Container className={classes.background} />
			<Stack className={classes.content}>
				<Title order={2} className={classes.title}>
					This Auction Has Not Started Yet
				</Title>
				<Text className={classes.description}>
					You cannot participate in this auction yet as it has not started. Please check
					back later once the auction is live.
				</Text>
				{!auction.data.hasJoined && (
					<Button
						className={classes.button}
						onClick={() => joinAuction.mutate()}
						rightSection={<IconCheckbox size={16} />}
						loading={joinAuction.isPending}
					>
						Join Auction
					</Button>
				)}
			</Stack>
		</Stack>
	);
};
