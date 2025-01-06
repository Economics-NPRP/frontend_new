import { useTranslations } from 'next-intl';
import { use } from 'react';

import { AuctionCard } from '@/components/AuctionCard';
import {
	IGetPaginatedAuctionsOptions,
	getPaginatedAuctions,
	preloadPaginatedAuctions,
} from '@/lib/auctions';
import { ActionIcon, Container, Group, Select, Stack, Text, Title } from '@mantine/core';
import { IconChevronLeft, IconChevronRight, IconPointFilled } from '@tabler/icons-react';

import classes from './styles.module.css';

const QUERY_PARAMS: IGetPaginatedAuctionsOptions = {
	sortBy: 'end_datetime',
	sortDirection: 'asc',
	isLive: true,
} as const;

export default function EndingSoon() {
	preloadPaginatedAuctions(QUERY_PARAMS);
	const t = useTranslations();

	const { ok, errors, results } = use(getPaginatedAuctions(QUERY_PARAMS));
	if (!ok && errors) throw new Error('Failed to load auctions', { cause: errors.join(', ') });

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
							{t('marketplace.home.ending.heading')}
						</Title>
						<Text className={classes.subheading}>
							{t('marketplace.home.ending.subheading')}
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
						placeholder={t('marketplace.home.ending.filter.prompt')}
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
				{results.map((auction) => (
					<AuctionCard key={auction.id} auction={auction} />
				))}
			</Group>
		</Stack>
	);
}
