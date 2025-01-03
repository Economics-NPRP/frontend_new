import { useTranslations } from 'next-intl';

import { AuctionCard } from '@/components/AuctionCard';
import { ActionIcon, Container, Group, Select, Stack, Text, Title } from '@mantine/core';
import { IconChevronLeft, IconChevronRight, IconPointFilled } from '@tabler/icons-react';

import classes from './styles.module.css';

export default function LatestOfferings() {
	const t = useTranslations();

	return (
		<Stack className={classes.root}>
			<Container className={classes.bg}>
				<Container className={`${classes.grid} bg-grid-lg`} />
				<Container className={classes.gradient} />
			</Container>
			<Group className={classes.header}>
				<Group className={classes.left}>
					<Stack className={classes.label}>
						<Title className={classes.heading}>
							{t('marketplace.home.latest.heading')}
						</Title>
						<Text className={classes.subheading}>
							{t('marketplace.home.latest.subheading')}
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
						placeholder={t('marketplace.home.latest.filter.prompt')}
						data={[
							t('constants.auctionCategory.energy.title'),
							t('constants.auctionCategory.industry.title'),
							t('constants.auctionCategory.transport.title'),
							t('constants.auctionCategory.buildings.title'),
							t('constants.auctionCategory.agriculture.title'),
							t('constants.auctionCategory.waste.title'),
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
