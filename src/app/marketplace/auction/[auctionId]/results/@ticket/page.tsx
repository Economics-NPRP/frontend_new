'use client';

import { useFormatter } from 'next-intl';
import { useContext, useMemo } from 'react';

import { CategoryBadge, CurrencyBadge } from '@/components/Badge';
import {
	Anchor,
	Button,
	Container,
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
} from '@mantine/core';
import { IconArrowUpLeft } from '@tabler/icons-react';

import { AuctionResultsContext } from '../constants';

export default function Ticket() {
	const format = useFormatter();
	const { auctionData, myOpenAuctionResults } = useContext(AuctionResultsContext);

	const percentage = useMemo(
		() => (myOpenAuctionResults.permitsReserved / auctionData.permits) * 100,
		[myOpenAuctionResults.permitsReserved, auctionData.permits],
	);

	return (
		<>
			<Group>
				<Button
					component="a"
					href={`/marketplace/auction/${auctionData.id}`}
					leftSection={<IconArrowUpLeft />}
				>
					Return to Auction Page
				</Button>
			</Group>
			<Container className="h-screen flex justify-center items-center">
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
									{format.number(myOpenAuctionResults.permitsReserved * 1000)}{' '}
									tCO2e
								</TableTd>
							</TableTr>

							<TableTr>
								<TableTd>Average Cost Per Permit</TableTd>
								<TableTd>
									<CurrencyBadge />
									{format.number(
										myOpenAuctionResults.averagePricePerPermit,
										'money',
									)}
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
								<TableTd>
									{format.number(myOpenAuctionResults.totalBidsCount)} Bids
								</TableTd>
							</TableTr>
						</TableTbody>
					</Table>

					<Stack>
						<Text>You owe</Text>
						<Group>
							<CurrencyBadge />
							<Text>{format.number(myOpenAuctionResults.finalBill, 'money')}</Text>
						</Group>
						<Anchor>View Corresponding Bids</Anchor>
					</Stack>
				</Stack>
			</Container>
		</>
	);
}
