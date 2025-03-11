'use client';

import { sortBy } from 'lodash-es';
import { DateTime } from 'luxon';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useFormatter } from 'next-intl';
import { useCallback, useContext, useMemo, useState } from 'react';

import { CurrencyBadge } from '@/components/Badge';
import { LargeCountdown } from '@/components/Countdown';
import {
	ActionIcon,
	Alert,
	Button,
	Group,
	List,
	Modal,
	NumberInput,
	Progress,
	Stack,
	Text,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure, useListState } from '@mantine/hooks';
import { IconChartLine, IconExclamationCircle, IconPencil, IconX } from '@tabler/icons-react';

import { AuctionDetailsContext } from '../constants';

interface BidTableData {
	bid: number;
	emissions: number;
	permit: number;
	subtotal: number;
}

export default function Prompt() {
	const format = useFormatter();
	const { auctionData } = useContext(AuctionDetailsContext);

	const [subtotal, setSubtotal] = useState(0);
	const [bids, bidsHandlers] = useListState<BidTableData>();
	const [selectedBids, selectedBidsHandlers] = useListState<BidTableData>();
	const [sortStatus, setSortStatus] = useState<DataTableSortStatus<BidTableData>>({
		columnAccessor: 'bid',
		direction: 'desc',
	});

	const [deletingBids, deletingBidsHandlers] = useListState<number>();
	const [deleteModalOpened, deleteModalActions] = useDisclosure(false);

	const totalPermits = useMemo(() => bids.reduce((acc, { permit }) => acc + permit, 0), [bids]);
	const grandTotal = useMemo(
		() => bids.reduce((acc, { bid, permit }) => acc + bid * permit, 0),
		[bids],
	);

	const form = useForm<BidTableData>({
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
				if (bids.some((bid) => bid.bid === value))
					return 'You have already bid this amount. Please edit the existing bid';
				return false;
			},
		},
		transformValues: ({ bid, permit }) => ({
			bid: Number(bid),
			permit: Number(permit),
			emissions: Number(permit) * 1000,
			subtotal: Number(bid) * Number(permit),
		}),
	});

	const bidsData = useMemo<Array<BidTableData>>(() => {
		const sortedData = sortBy(bids, sortStatus.columnAccessor);
		return sortStatus.direction === 'asc' ? sortedData : sortedData.reverse();
	}, [bids, sortStatus]);

	const errorMessages = useMemo(
		() =>
			Object.values(form.errors).map((error, index) => (
				<List.Item key={index}>{error}</List.Item>
			)),
		[form.errors],
	);

	const onSubmitHandler = useCallback(
		(values: BidTableData) => {
			bidsHandlers.append(values);
			form.reset();
		},
		[bidsHandlers],
	);

	const onStartDeleteBidHandler = useCallback(
		(bidIds: Array<number>) => {
			deletingBidsHandlers.setState(bidIds);
			deleteModalActions.open();
		},
		[selectedBidsHandlers, deletingBidsHandlers],
	);

	const onConfirmDeleteBidHandler = useCallback(() => {
		//	Remove the selected bids from the bids list
		bidsHandlers.filter(({ bid }) => !deletingBids.includes(bid));

		//	Deselect the selected bids
		selectedBidsHandlers.filter(({ bid }) => !deletingBids.includes(bid));

		//	Reset the deletingBids list
		deletingBidsHandlers.setState([]);
		deleteModalActions.close();
	}, [selectedBidsHandlers, bidsHandlers]);

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
								max={auctionData.permits - totalPermits}
								name="permit"
								key={form.key('permit')}
								{...form.getInputProps('permit')}
							/>
							<Text>Permits</Text>
							<NumberInput
								placeholder="Price per permit"
								leftSection={<CurrencyBadge />}
								min={1}
								name="bid"
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
					<DataTable
						columns={[
							{ accessor: 'permit', sortable: true },
							{ accessor: 'emissions', sortable: true },
							{ accessor: 'bid', sortable: true },
							{ accessor: 'subtotal', sortable: true },
							{
								accessor: 'actions',
								render: ({ bid }) => (
									<Group className="gap-2">
										<ActionIcon variant="transparent">
											<IconPencil size={16} />
										</ActionIcon>
										<ActionIcon
											variant="transparent"
											onClick={() => onStartDeleteBidHandler([bid])}
										>
											<IconX size={16} />
										</ActionIcon>
									</Group>
								),
							},
						]}
						records={bidsData}
						striped
						withRowBorders
						highlightOnHover
						sortStatus={sortStatus}
						onSortStatusChange={setSortStatus}
						selectedRecords={selectedBids}
						onSelectedRecordsChange={selectedBidsHandlers.setState}
						idAccessor="bid"
						selectionTrigger="cell"
					/>
					<Button
						disabled={selectedBids.length === 0}
						onClick={() => onStartDeleteBidHandler(selectedBids.map(({ bid }) => bid))}
					>
						Delete {selectedBids.length} Bid Items
					</Button>
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

			<Modal
				title="Delete Confirmation"
				opened={deleteModalOpened}
				onClose={deleteModalActions.close}
				centered
			>
				<Text>Are you sure you want to delete this bid?</Text>
				<Group>
					<Button onClick={deleteModalActions.close}>Cancel</Button>
					<Button onClick={onConfirmDeleteBidHandler} color="red">
						Delete
					</Button>
				</Group>
			</Modal>
		</>
	);
}
