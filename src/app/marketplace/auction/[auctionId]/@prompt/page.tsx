'use client';

import { DateTime } from 'luxon';
import { useContext } from 'react';

import { CurrencyBadge } from '@/components/Badge';
import { LargeCountdown } from '@/components/Countdown';
import {
	ActionIcon,
	Button,
	Checkbox,
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
	TextInput,
} from '@mantine/core';
import { IconChartLine } from '@tabler/icons-react';

import { AuctionDetailsContext } from '../constants';

export default function Prompt() {
	const { auctionData } = useContext(AuctionDetailsContext);

	return (
		<>
			<Stack>
				<Text>Ending In</Text>
				<LargeCountdown targetDate={auctionData.endDatetime} />
				<Text>
					{DateTime.fromISO(auctionData.endDatetime).toLocaleString(
						DateTime.DATETIME_FULL,
					)}
				</Text>
			</Stack>
			<Stack>
				<Text>Buy Now Price</Text>
				<Group>
					<CurrencyBadge />
					<Text>1,400.00</Text>
				</Group>
				<Button>Buy Now</Button>
			</Stack>
			<Group>
				<Stack>
					<Text>Minimum Winning Bid</Text>
					<Group>
						<CurrencyBadge />
						<Text>1,105.99</Text>
					</Group>
					<ActionIcon>
						<IconChartLine />
					</ActionIcon>
				</Stack>
				<Stack>
					<Group>
						<TextInput placeholder="000,000" />
						<Text>Permits</Text>
						<TextInput placeholder="Price per permit" leftSection={<CurrencyBadge />} />
						<Text>Each</Text>
						<Text>Total QAR 0.00</Text>
						<Button>Add to List</Button>
					</Group>
					<Group>
						<Text>0 permits bid</Text>
						<Progress w={480} value={0} />
						<Text>153 permits left</Text>
					</Group>
					<Table>
						<TableThead>
							<TableTr>
								<TableTh></TableTh>
								<TableTh>Number of Permits</TableTh>
								<TableTh>Emissions (tCO2e)</TableTh>
								<TableTh>Price per Permit</TableTh>
								<TableTh>Sub Total</TableTh>
							</TableTr>
						</TableThead>
						<TableTbody>
							<TableTr>
								<TableTd>
									<Checkbox />
								</TableTd>
								<TableTd>1</TableTd>
								<TableTd>1,000.00</TableTd>
								<TableTd>
									<CurrencyBadge />
									10.00
								</TableTd>
								<TableTd>
									<CurrencyBadge />
									10,000.00
								</TableTd>
							</TableTr>
							<TableTr>
								<TableTd>
									<Checkbox />
								</TableTd>
								<TableTd>1</TableTd>
								<TableTd>1,000.00</TableTd>
								<TableTd>
									<CurrencyBadge />
									10.00
								</TableTd>
								<TableTd>
									<CurrencyBadge />
									10,000.00
								</TableTd>
							</TableTr>
							<TableTr>
								<TableTd>
									<Checkbox />
								</TableTd>
								<TableTd>1</TableTd>
								<TableTd>1,000.00</TableTd>
								<TableTd>
									<CurrencyBadge />
									10.00
								</TableTd>
								<TableTd>
									<CurrencyBadge />
									10,000.00
								</TableTd>
							</TableTr>
						</TableTbody>
					</Table>
					<Stack>
						<Text>Grand Total</Text>
						<Group>
							<Stack>
								<Text>Permits</Text>
								<Text>0</Text>
							</Stack>
							<Stack>
								<Text>Emissions (tCO2e)</Text>
								<Text>0</Text>
							</Stack>
							<Stack>
								<Text>Bid (QAR)</Text>
								<Text>0.00</Text>
							</Stack>
						</Group>
					</Stack>
				</Stack>
			</Group>
			<Button>Place a Bid</Button>
		</>
	);
}
