'use client';

import { DateTime } from 'luxon';
import { useFormatter } from 'next-intl';
import { useCallback, useContext, useMemo, useState } from 'react';

import { CurrencyBadge } from '@/components/Badge';
import { LargeCountdown } from '@/components/Countdown';
import {
	ActionIcon,
	Alert,
	Button,
	Checkbox,
	Group,
	List,
	NumberInput,
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
import { useForm } from '@mantine/form';
import { useListState } from '@mantine/hooks';
import { IconChartLine, IconExclamationCircle } from '@tabler/icons-react';

import { AuctionDetailsContext } from '../constants';

interface FormValues {
	bid: number;
	permit: number;
}

export default function Prompt() {
	const format = useFormatter();
	const { auctionData } = useContext(AuctionDetailsContext);

	const [subtotal, setSubtotal] = useState(0);
	const [bids, bidsHandlers] = useListState<FormValues>();

	const totalPermits = useMemo(() => bids.reduce((acc, { permit }) => acc + permit, 0), [bids]);
	const grandTotal = useMemo(
		() => bids.reduce((acc, { bid, permit }) => acc + bid * permit, 0),
		[bids],
	);

	const form = useForm<FormValues>({
		mode: 'uncontrolled',
		onValuesChange: ({ bid, permit }) => setSubtotal(Number(bid || 0) * Number(permit || 0)),
		validate: {
			permit: (value) => {
				if (!value) return 'Permit is required';
				if (value < 1) return 'You must bid at least 1 permit';
				if (value > auctionData.permits) return 'You cannot bid more than permits offered';
				if (value > auctionData.permits - totalPermits)
					return 'You cannot bid more than available permits. Please check the bid table';
				return false;
			},
			bid: (value) => {
				if (!value) return 'Bid is required';
				if (value < 1) return 'Bid must be greater than 0';
				return false;
			},
		},
	});

	const bidsData = useMemo(
		() =>
			bids.map(({ bid, permit }, index) => (
				<TableTr key={index}>
					<TableTd>
						<Checkbox />
					</TableTd>
					<TableTd>{format.number(permit)}</TableTd>
					<TableTd>{format.number(permit * 1000)}</TableTd>
					<TableTd>
						<CurrencyBadge />
						{format.number(bid, 'money')}
					</TableTd>
					<TableTd>
						<CurrencyBadge />
						{format.number(bid * permit, 'money')}
					</TableTd>
				</TableTr>
			)),
		[bids],
	);

	const errorMessages = useMemo(
		() =>
			Object.values(form.errors).map((error, index) => (
				<List.Item key={index}>{error}</List.Item>
			)),
		[form.errors],
	);

	const onSubmitHandler = useCallback(
		(values: FormValues) => {
			bidsHandlers.append(values);
			form.reset();
		},
		[bidsHandlers],
	);

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
					{errorMessages.length > 0 && (
						<Alert
							variant="light"
							color="red"
							title="There was a problem adding your bid"
							icon={<IconExclamationCircle />}
						>
							<List>{errorMessages}</List>
						</Alert>
					)}
					<form onSubmit={form.onSubmit(onSubmitHandler)}>
						<Group>
							<NumberInput
								placeholder="000,000"
								min={1}
								max={auctionData.permits}
								key={form.key('permit')}
								{...form.getInputProps('permit')}
							/>
							<Text>Permits</Text>
							<NumberInput
								placeholder="Price per permit"
								leftSection={<CurrencyBadge />}
								min={1}
								key={form.key('bid')}
								{...form.getInputProps('bid')}
							/>
							<Text>Each</Text>
							<Text>Total QAR {format.number(subtotal, 'money')}</Text>
							<Button type="submit">Add to List</Button>
						</Group>
					</form>
					<Group>
						<Text>{totalPermits} permits bid</Text>
						<Progress w={480} value={(totalPermits / auctionData.permits) * 100} />
						<Text>{auctionData.permits - totalPermits} permits left</Text>
					</Group>
					<Table>
						<TableThead>
							<TableTr>
								<TableTh>
									<Checkbox />
								</TableTh>
								<TableTh>Number of Permits</TableTh>
								<TableTh>Emissions (tCO2e)</TableTh>
								<TableTh>Price per Permit</TableTh>
								<TableTh>Sub Total</TableTh>
							</TableTr>
						</TableThead>
						<TableTbody>{bidsData}</TableTbody>
					</Table>
					<Stack>
						<Text>Grand Total</Text>
						<Group>
							<Stack>
								<Text>Permits</Text>
								<Text>{format.number(totalPermits)}</Text>
							</Stack>
							<Stack>
								<Text>Emissions (tCO2e)</Text>
								<Text>{format.number(totalPermits * 1000)}</Text>
							</Stack>
							<Stack>
								<Text>Bid</Text>
								<Group>
									<CurrencyBadge />
									<Text>{format.number(grandTotal, 'money')}</Text>
								</Group>
							</Stack>
						</Group>
					</Stack>
				</Stack>
			</Group>
			<Button>Place a Bid</Button>
		</>
	);
}
