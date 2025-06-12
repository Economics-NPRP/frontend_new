import { useParams } from 'next/navigation';

import { Button, Container, Stack, Text, Title } from '@mantine/core';
import { IconArrowUpRight } from '@tabler/icons-react';

import classes from './styles.module.css';

export const EndedOverlay = () => {
	const { auctionId } = useParams();

	return (
		<Stack className={classes.overlay}>
			<Container className={classes.background} />
			<Stack className={classes.content}>
				<Title order={2} className={classes.title}>
					This Auction Has Ended
				</Title>
				<Text className={classes.description}>
					You cannot participate in this auction anymore as it has ended. You can choose
					to take a look at the results, or view the page in read-only mode
				</Text>
				<Button
					className={classes.button}
					component="a"
					href={`/marketplace/auction/${auctionId}/results`}
					rightSection={<IconArrowUpRight size={16} />}
				>
					View Results
				</Button>
			</Stack>
		</Stack>
	);
};
