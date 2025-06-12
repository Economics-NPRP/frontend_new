import { useFormatter } from 'next-intl';
import { useContext, useMemo } from 'react';

import { CategoryBadge, CurrencyBadge } from '@/components/Badge';
import { MyOpenAuctionResultsContext, SingleAuctionContext } from '@/contexts';
import { useAuctionAvailability } from '@/hooks';
import { CurrentUserContext } from '@/pages/globalContext';
import { Button, Container, Group, Progress, Stack, Text } from '@mantine/core';
import { IconArrowUpRight, IconLeaf } from '@tabler/icons-react';

import classes from './styles.module.css';

export const Winner = () => {
	const format = useFormatter();
	const currentUser = useContext(CurrentUserContext);
	const auction = useContext(SingleAuctionContext);
	const myOpenAuctionResults = useContext(MyOpenAuctionResultsContext);

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
						<Text className={classes.subtext}>Your Winnings</Text>
						<Group className={classes.row}>
							<Text className={classes.value}>
								{myOpenAuctionResults.data.permitsReserved}
							</Text>
							<Text className={classes.unit}>Permits</Text>
						</Group>
					</Stack>
					<Stack className={classes.percentage}>
						<Group className={classes.row}>
							<Text className={classes.key}>Winnings Percentage</Text>
							<Text className={classes.value}>
								{format.number(percentage, 'money')}%
							</Text>
						</Group>
						<Progress className={classes.progress} value={percentage} color="white" />
					</Stack>
				</Stack>
				<Stack className={classes.middle}>
					<Group className={classes.header}>
						<Text className={classes.key}>Property</Text>
						<Text className={classes.value}>Value</Text>
					</Group>
					<Group className={classes.row}>
						<Text className={classes.key}>Source</Text>
						<Text className={classes.value}>Flare Gas Burning</Text>
					</Group>
					<Group className={classes.row}>
						<Text className={classes.key}>Sector</Text>
						<CategoryBadge category={'industry'} />
					</Group>
					<Group className={classes.row}>
						<Text className={classes.key}>Awarded To</Text>
						<Text className={classes.value}>{currentUser.currentUser.name}</Text>
					</Group>
					<Group className={classes.row}>
						<Text className={classes.key}>Number of Emissions</Text>
						<Text className={classes.value}>
							{format.number(myOpenAuctionResults.data.permitsReserved * 1000)} tCO2e
						</Text>
					</Group>
				</Stack>
				<Group className={classes.divider}>
					<Container className={classes.dot} />
					<Container className={classes.line} />
					<Text className={classes.label}>ETS</Text>
					<Container className={classes.line} />
					<Container className={classes.dot} />
				</Group>
				<Stack className={classes.lower}>
					<Text className={classes.title}>Final Bill</Text>
					<Group className={classes.row}>
						<CurrencyBadge />
						<Text className={classes.value}>
							{format.number(myOpenAuctionResults.data.finalBill, 'money')}
						</Text>
					</Group>
					<Text className={classes.subtext}>
						Scroll down to view the bids used for calculation
					</Text>
				</Stack>
			</Stack>

			<Stack className={classes.footer}>
				<Button
					className={classes.button}
					rightSection={<IconArrowUpRight size={16} />}
					disabled={!hasEnded}
				>
					Continue
				</Button>
				<Text className={classes.subtext}>
					Clicking "Continue" will bring you to the checkout page where you can learn what
					to do next and claim your permits
				</Text>
			</Stack>
		</>
	);
};
