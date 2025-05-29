import { useFormatter } from 'next-intl';
import { useCallback, useContext, useMemo, useState } from 'react';

import { CurrencyBadge } from '@/components/Badge';
import { BidTableData } from '@/pages/marketplace/auction/[auctionId]/(details)/_components/BidTable';
import {
	AuctionBiddingContext,
	AuctionDetailsContext,
} from '@/pages/marketplace/auction/[auctionId]/(details)/_components/Providers';
import { Alert, Button, Group, List, NumberInput, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconExclamationCircle } from '@tabler/icons-react';

export const InsertForm = () => {
	const format = useFormatter();
	const { auctionData } = useContext(AuctionDetailsContext);
	const { bids, bidsHandlers, totalPermits } = useContext(AuctionBiddingContext);

	const [subtotal, setSubtotal] = useState(0);

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

	const errorMessages = useMemo(
		() =>
			Object.values(form.errors).map((error, index) => (
				<List.Item key={index}>{error}</List.Item>
			)),
		[form.errors],
	);

	const onSubmitHandler = useCallback(
		(values: BidTableData) => {
			if (!auctionData.hasJoined) return;
			bidsHandlers.append(values);
			form.reset();
		},
		[bidsHandlers],
	);

	return (
		<>
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
						disabled={!auctionData.hasJoined}
						{...form.getInputProps('permit')}
					/>
					<Text>Permits</Text>
					<NumberInput
						placeholder="Price per permit"
						leftSection={<CurrencyBadge />}
						min={1}
						name="bid"
						key={form.key('bid')}
						disabled={!auctionData.hasJoined}
						{...form.getInputProps('bid')}
					/>
					<Text>Each</Text>
					<Text>Total QAR {format.number(subtotal, 'money')}</Text>
					<Button type="submit" disabled={!auctionData.hasJoined}>
						Add to List
					</Button>
				</Group>
			</form>
		</>
	);
};
