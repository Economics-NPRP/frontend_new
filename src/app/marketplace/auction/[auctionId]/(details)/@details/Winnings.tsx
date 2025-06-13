import { useFormatter } from 'next-intl';
import { useContext, useMemo } from 'react';

import { CurrencyBadge } from '@/components/Badge';
import { Switch } from '@/components/SwitchCase';
import { MyOpenAuctionResultsContext, SingleAuctionContext } from '@/contexts';
import { useAuctionAvailability } from '@/hooks';
import {
	ActionIcon,
	Container,
	Divider,
	Group,
	Skeleton,
	Stack,
	Text,
	Title,
	Tooltip,
} from '@mantine/core';
import {
	IconArrowUpRight,
	IconCoins,
	IconInfoCircle,
	IconLeaf,
	IconLicense,
} from '@tabler/icons-react';

import classes from './styles.module.css';

export const Winnings = () => {
	const format = useFormatter();
	const auction = useContext(SingleAuctionContext);
	const myOpenAuctionResults = useContext(MyOpenAuctionResultsContext);

	const { areResultsAvailable } = useAuctionAvailability();

	const currentState = useMemo(() => {
		if (myOpenAuctionResults.isLoading || auction.isLoading) return 'loading';
		if (!areResultsAvailable) return 'unavailable';
		return 'available';
	}, [myOpenAuctionResults.isLoading, auction.isLoading, areResultsAvailable]);

	return (
		<Stack className={`${classes.winnings} ${classes.section}`}>
			<Divider
				label={
					<Group className={classes.row}>
						<Text className={classes.label}>Your Current Winnings</Text>
						<Tooltip
							position="top"
							label="Estimated number of permits you will win based on the current winning bids"
						>
							<IconInfoCircle size={14} className={classes.info} />
						</Tooltip>
					</Group>
				}
				classNames={{
					root: classes.divider,
					label: classes.label,
				}}
			/>

			<Switch value={currentState}>
				<Switch.Case when="loading">
					<Group className={classes.row}>
						<Stack className={classes.cell}>
							<Container className={classes.icon}>
								<IconLicense size={16} />
							</Container>
							<Text className={classes.key}>Estimated # of Permits</Text>
							<Skeleton width={100} height={28} visible data-dark />
						</Stack>
						<Stack className={classes.cell}>
							<Container className={classes.icon}>
								<IconLeaf size={16} />
							</Container>
							<Text className={classes.key}>Estimated # of Emissions</Text>
							<Skeleton width={120} height={28} visible data-dark />
						</Stack>
						<Stack className={classes.cell}>
							<Container className={classes.icon}>
								<IconCoins size={16} />
							</Container>
							<Text className={classes.key}>Estimated Final Bill</Text>
							<Skeleton width={160} height={28} visible data-dark />
						</Stack>
					</Group>
				</Switch.Case>
				<Switch.Case when="unavailable">
					<Stack className={classes.alert}>
						<Title order={3} className={classes.title}>
							{auction.data.type === 'sealed'
								? 'Results are currently unavailable'
								: 'You have not joined the auction yet'}
						</Title>
						<Text className={classes.description}>
							{auction.data.type === 'sealed'
								? 'The auction results will be released after the auction ends and all bids have been processed.'
								: 'Please join the auction to see your estimated winnings.'}
						</Text>
					</Stack>
				</Switch.Case>
				<Switch.Case when="available">
					<Group className={classes.row}>
						<Stack className={classes.cell}>
							<Container className={classes.icon}>
								<IconLicense size={16} />
							</Container>
							<Text className={classes.key}>Estimated # of Permits</Text>
							<Group className={classes.row}>
								<Text className={classes.value}>
									{format.number(
										Math.round(myOpenAuctionResults.data.permitsReserved),
									)}
								</Text>
								<Text className={classes.unit}>permits</Text>
							</Group>
						</Stack>
						<Stack className={classes.cell}>
							<Container className={classes.icon}>
								<IconLeaf size={16} />
							</Container>
							<Text className={classes.key}>Estimated # of Emissions</Text>
							<Group className={classes.row}>
								<Text className={classes.value}>
									{format.number(
										// TODO: Replace with actual emissions calculation
										Math.round(
											myOpenAuctionResults.data.permitsReserved * 1000,
										),
									)}
								</Text>
								<Text className={classes.unit}>tCO2e</Text>
							</Group>
						</Stack>
						<Stack className={classes.cell}>
							<Container className={classes.icon}>
								<IconCoins size={16} />
							</Container>
							<Text className={classes.key}>Estimated Final Bill</Text>
							<Group className={classes.row}>
								<CurrencyBadge className={classes.badge} />
								<Text className={classes.value}>
									{format.number(
										Math.round(myOpenAuctionResults.data.finalBill),
										'money',
									)}
								</Text>
							</Group>
						</Stack>
						<Tooltip label="View full auction results">
							<ActionIcon
								className={classes.cell}
								component="a"
								href={`/marketplace/auction/${auction.data.id}/results`}
							>
								<IconArrowUpRight size={24} />
							</ActionIcon>
						</Tooltip>
					</Group>
				</Switch.Case>
			</Switch>
		</Stack>
	);
};
