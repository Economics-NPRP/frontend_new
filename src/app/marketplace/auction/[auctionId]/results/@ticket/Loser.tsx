'use client';

import { useTranslations } from 'next-intl';
import { useContext } from 'react';

import { AuctionCard } from '@/components/AuctionCard';
import { SingleAuctionContext } from '@/contexts';
import { AuctionResultsPageContext } from '@/pages/marketplace/auction/[auctionId]/results/_components/Providers';
import { Button, Divider, Group, Stack, Text, Title } from '@mantine/core';

import classes from './styles.module.css';

export const Loser = () => {
	const t = useTranslations();
	const auction = useContext(SingleAuctionContext);
	const { scrollToHistory } = useContext(AuctionResultsPageContext);

	return (
		<Stack className={`${classes.loser} ${classes.ticket}`}>
			<Stack className={classes.header}>
				<Title order={2} className={classes.title}>
					{t('marketplace.auction.results.ticket.loser.title')}
				</Title>
				<Text className={classes.subtitle}>
					{t('marketplace.auction.results.ticket.loser.subtitle')}
				</Text>
			</Stack>
			<Button className={classes.button} onClick={scrollToHistory}>
				{t('constants.view.biddingHistory.label')}
			</Button>
			<Divider className={classes.divider} label="OR" />
			<Text className={classes.subtext}>
				{t('marketplace.auction.results.ticket.loser.subtext')}
			</Text>
			<Group className={classes.auctions}>
				<AuctionCard auction={auction.data} />
				<AuctionCard auction={auction.data} />
				<AuctionCard auction={auction.data} />
				<AuctionCard auction={auction.data} />
			</Group>
		</Stack>
	);
};
