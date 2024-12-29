import { AuctionCard } from '@/components/AuctionCard';
import { ActionIcon, Container, Group, Select, Stack, Text, Title } from '@mantine/core';
import { IconChevronLeft, IconChevronRight, IconPointFilled } from '@tabler/icons-react';

import classes from './styles.module.css';

export default function LatestOfferings() {
	return (
		<Stack className={classes.root}>
			<Container className={classes.bg}>
				<Container className={`${classes.grid} bg-grid-lg`} />
				<Container className={classes.gradient} />
			</Container>
			<Group className={classes.header}>
				<Group className={classes.left}>
					<Stack className={classes.label}>
						<Title className={classes.heading}>Latest Auctions</Title>
						<Text className={classes.subheading}>
							Explore the latest auctions available in the marketplace
						</Text>
					</Stack>
					<Group className={classes.dots}>
						<IconPointFilled size={12} />
						<IconPointFilled size={12} />
						<IconPointFilled size={12} />
						<IconPointFilled size={12} />
						<IconPointFilled size={12} />
					</Group>
				</Group>
				<Group className={classes.right}>
					<Select
						className={classes.dropdown}
						placeholder="Filter by category"
						data={[
							'Energy',
							'Industry',
							'Transport',
							'Buildings',
							'Agriculture',
							'Waste',
						]}
					/>
					<ActionIcon className={classes.button}>
						<IconChevronLeft size={20} />
					</ActionIcon>
					<ActionIcon className={classes.button}>
						<IconChevronRight size={20} />
					</ActionIcon>
				</Group>
			</Group>
			<Group className={classes.content}>
				<AuctionCard />
				<AuctionCard />
				<AuctionCard />
			</Group>
		</Stack>
	);
}
