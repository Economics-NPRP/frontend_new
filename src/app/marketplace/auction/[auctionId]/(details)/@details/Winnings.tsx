import { useFormatter } from 'next-intl';
import { useContext } from 'react';

import { CurrencyBadge } from '@/components/Badge';
import { MyOpenAuctionResultsContext, SingleAuctionContext } from '@/contexts';
import { useAuctionAvailability } from '@/hooks';
import { Alert, Button, Container, Divider, Group, Stack, Text, Tooltip } from '@mantine/core';
import {
	IconCoins,
	IconExclamationCircle,
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
			{!areResultsAvailable && (
				<Alert
					variant="light"
					color="gray"
					title={
						auction.data.type === 'sealed'
							? 'Results are currently unavailable'
							: 'You have not joined the auction yet'
					}
					icon={<IconExclamationCircle />}
				>
					{auction.data.type === 'sealed'
						? 'The auction results will be released after the auction ends and all bids have been processed.'
						: 'Please join the auction to see your estimated winnings.'}
				</Alert>
			)}
			{areResultsAvailable && (
				<>
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
						<Divider orientation="vertical" className={classes.divider} />
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
						<Divider orientation="vertical" className={classes.divider} />
						<Stack className={classes.cell}>
							<Container className={classes.icon}>
								<IconCoins size={16} />
							</Container>
							<Text className={classes.key}>Estimated Final Bill</Text>
							<Group className={classes.row}>
								<CurrencyBadge />
								<Text className={classes.value}>
									{format.number(
										Math.round(myOpenAuctionResults.data.finalBill),
										'money',
									)}
								</Text>
							</Group>
						</Stack>
					</Group>
					<Button
						className={classes.subtle}
						component="a"
						href={`/marketplace/auction/${auction.data.id}/results`}
						variant="subtle"
					>
						View Full Results
					</Button>
				</>
			)}
		</Stack>
	);
};
