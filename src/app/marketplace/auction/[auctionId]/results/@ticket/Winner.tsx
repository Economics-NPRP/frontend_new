import { useFormatter, useTranslations } from 'next-intl';
import { useContext, useMemo } from 'react';

import { CategoryBadge, CurrencyBadge } from '@/components/Badge';
import { MyOpenAuctionResultsContext, MyUserContext, SingleAuctionContext } from '@/contexts';
import { useAuctionAvailability } from '@/hooks';
import { Button, Container, Group, Progress, Stack, Text } from '@mantine/core';
import { IconArrowUpRight, IconLeaf } from '@tabler/icons-react';

import classes from './styles.module.css';

export const Winner = () => {
	const t = useTranslations();
	const format = useFormatter();
	const auction = useContext(SingleAuctionContext);
	const myOpenAuctionResults = useContext(MyOpenAuctionResultsContext);
	const myUser = useContext(MyUserContext);

	const percentage = useMemo(
		() => (myOpenAuctionResults.data.permitsReserved / auction.data.permits) * 100,
		[myOpenAuctionResults.data.permitsReserved, auction.data.permits],
	);

	const { hasEnded } = useAuctionAvailability();

	return (
		<>
			<Stack className={`${classes.winner} ${classes.ticket}`}>
				<Stack className={classes.upper}>
					<Container className={classes.icon}>
						<IconLeaf size={20} />
					</Container>
					<Stack className={classes.winnings}>
						<Text className={classes.subtext}>
							{t('marketplace.auction.results.ticket.winner.title')}
						</Text>
						<Group className={classes.row}>
							<Text className={classes.value}>
								{myOpenAuctionResults.data.permitsReserved}
							</Text>
							<Text className={classes.unit}>{t('constants.permits.key')}</Text>
						</Group>
					</Stack>
					<Stack className={classes.percentage}>
						<Group className={classes.row}>
							<Text className={classes.key}>
								{t('marketplace.auction.results.ticket.winner.winningsPercent')}
							</Text>
							<Text className={classes.value}>
								{t('constants.quantities.percent.default', { value: percentage })}
							</Text>
						</Group>
						<Progress className={classes.progress} value={percentage} color="white" />
					</Stack>
				</Stack>
				<Stack className={classes.middle}>
					<Group className={classes.header}>
						<Text className={classes.key}>
							{t('marketplace.auction.results.ticket.winner.properties.header.key')}
						</Text>
						<Text className={classes.value}>
							{t('marketplace.auction.results.ticket.winner.properties.header.value')}
						</Text>
					</Group>
					<Group className={classes.row}>
						<Text className={classes.key}>
							{t('marketplace.auction.results.ticket.winner.properties.sector.key')}
						</Text>
						<CategoryBadge category={'industry'} />
					</Group>
					<Group className={classes.row}>
						<Text className={classes.key}>
							{t(
								'marketplace.auction.results.ticket.winner.properties.subsector.key',
							)}
						</Text>
						<Text className={classes.value}>Flare Gas Burning</Text>
					</Group>
					<Group className={classes.row}>
						<Text className={classes.key}>
							{t(
								'marketplace.auction.results.ticket.winner.properties.awardedTo.key',
							)}
						</Text>
						<Text className={classes.value}>{myUser.data.name}</Text>
					</Group>
					<Group className={classes.row}>
						<Text className={classes.key}>
							{t(
								'marketplace.auction.results.ticket.winner.properties.emissions.key',
							)}
						</Text>
						<Text className={classes.value}>
							{t('constants.quantities.emissions.default', {
								value: myOpenAuctionResults.data.permitsReserved * 1000,
							})}
						</Text>
					</Group>
				</Stack>
				<Group className={classes.divider}>
					<Container className={classes.dot} />
					<Container className={classes.line} />
					<Text className={classes.label}>{t('constants.website.name.short')}</Text>
					<Container className={classes.line} />
					<Container className={classes.dot} />
				</Group>
				<Stack className={classes.lower}>
					<Text className={classes.title}>
						{t('marketplace.auction.results.ticket.winner.summary.title')}
					</Text>
					<Group className={classes.row}>
						<CurrencyBadge />
						<Text className={classes.value}>
							{format.number(myOpenAuctionResults.data.finalBill, 'money')}
						</Text>
					</Group>
					<Text className={classes.subtext}>
						{t('marketplace.auction.results.ticket.winner.summary.subtext')}
					</Text>
				</Stack>
			</Stack>

			<Stack className={classes.footer}>
				<Button
					className={classes.button}
					rightSection={<IconArrowUpRight size={16} />}
					disabled={!hasEnded}
				>
					{t('constants.actions.continue.label')}
				</Button>
				<Text className={classes.subtext}>
					{t('marketplace.auction.results.ticket.winner.footer.subtext')}
				</Text>
			</Stack>
		</>
	);
};
