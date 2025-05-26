'use client';

import { useFormatter } from 'next-intl';
import { useContext, useMemo } from 'react';

import { AuctionCard } from '@/components/AuctionCard';
import { CategoryBadge, CurrencyBadge } from '@/components/Badge';
import {
	Button,
	Container,
	Divider,
	Group,
	Progress,
	Stack,
	Table,
	TableTbody,
	TableTd,
	TableTh,
	TableThead,
	TableTr,
	Text,
	Title,
} from '@mantine/core';
import { IconArrowUpLeft } from '@tabler/icons-react';

import { AuctionResultsContext } from '../constants';

export default function Ticket() {
	const format = useFormatter();
	const { scrollToHistory, auctionData, myOpenAuctionResults } =
		useContext(AuctionResultsContext);

	const percentage = useMemo(
		() => (myOpenAuctionResults.permitsReserved / auctionData.permits) * 100,
		[myOpenAuctionResults.permitsReserved, auctionData.permits],
	);

	const isEnded = useMemo(
		() => new Date(auctionData.endDatetime).getTime() < Date.now(),
		[auctionData.endDatetime],
	);
	const isWinner = useMemo(
		() => myOpenAuctionResults.permitsReserved > 0 && isEnded,
		[myOpenAuctionResults],
	);

	const winnerTicket = (
		<Stack>
			<Stack>
				<Text>You have won</Text>
				<Group>
					<Text>{myOpenAuctionResults.permitsReserved}</Text>
					<Text>Permits</Text>
				</Group>
			</Stack>
			<Stack>
				<Group>
					<Text>Winnings Percentage</Text>
					<Text>{format.number(percentage, 'money')}%</Text>
				</Group>
				<Progress value={percentage} />
			</Stack>
			<Table layout="fixed">
				<TableThead>
					<TableTr>
						<TableTh>Property</TableTh>
						<TableTh>Value</TableTh>
					</TableTr>
				</TableThead>
				<TableTbody>
					<TableTr>
						<TableTd>Source</TableTd>
						<TableTd>Flare Gas Burning</TableTd>
					</TableTr>

					<TableTr>
						<TableTd>Sector</TableTd>
						<TableTd>
							<CategoryBadge category={'industry'} />
						</TableTd>
					</TableTr>

					<TableTr>
						<TableTd>Awarded To</TableTd>
						<TableTd>
							{/* TODO: use actual user data */}
							test firm
						</TableTd>
					</TableTr>

					<TableTr>
						<TableTd>Number of Emissions</TableTd>
						<TableTd>
							{format.number(myOpenAuctionResults.permitsReserved * 1000)} tCO2e
						</TableTd>
					</TableTr>

					<TableTr>
						<TableTd>Average Cost Per Permit</TableTd>
						<TableTd>
							<CurrencyBadge />
							{format.number(myOpenAuctionResults.averagePricePerPermit, 'money')}
						</TableTd>
					</TableTr>

					<TableTr>
						<TableTd>Number of Winning Bids</TableTd>
						<TableTd>
							{format.number(myOpenAuctionResults.winningBidsCount)} Bids
						</TableTd>
					</TableTr>

					<TableTr>
						<TableTd>Number of Submitted Bids</TableTd>
						<TableTd>{format.number(myOpenAuctionResults.totalBidsCount)} Bids</TableTd>
					</TableTr>
				</TableTbody>
			</Table>

			<Stack>
				<Text>You owe</Text>
				<Group>
					<CurrencyBadge />
					<Text>{format.number(myOpenAuctionResults.finalBill, 'money')}</Text>
				</Group>
				<Button color="green">Continue</Button>
				<Text className="text-center paragraph-sm-g6">
					Clicking "Continue" will bring you to the checkout page where you can learn what
					to do next, claim your permits, and print an invoice.
				</Text>
			</Stack>
		</Stack>
	);

	const loserTicket = (
		<Stack className="gap-8">
			<Stack className="items-center justify-center gap-0">
				<Title order={2}>No Permits Awarded</Title>
				<Text className="paragraph-md">
					You did not win any permits in this auction. However, you may still view the
					bidding history and analyze the auction results.
				</Text>
			</Stack>
			<Button onClick={scrollToHistory}>View Bidding History</Button>
			<Divider label="OR" />
			<Text className="text-center paragraph-md">
				Check out some similar auctions that you might be interested in:
			</Text>
			<Group className="grid grid-cols-12 gap-4">
				<AuctionCard auction={auctionData} />
				<AuctionCard auction={auctionData} />
				<AuctionCard auction={auctionData} />
				<AuctionCard auction={auctionData} />
			</Group>
		</Stack>
	);

	return (
		<>
			<Group>
				<Button
					component="a"
					href={`/marketplace/auction/${auctionData.id}`}
					variant="outline"
					leftSection={<IconArrowUpLeft />}
				>
					Return to Auction Page
				</Button>
			</Group>
			<Container className="h-screen flex justify-center items-center">
				{isWinner && winnerTicket}
				{!isWinner && loserTicket}
			</Container>
		</>
	);
}
