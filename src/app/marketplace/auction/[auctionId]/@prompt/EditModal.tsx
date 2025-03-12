import { useFormatter } from 'next-intl';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { CurrencyBadge } from '@/components/Badge';
import { Button, Group, Modal, NumberInput, Text } from '@mantine/core';
import { useForm } from '@mantine/form';

import { AuctionDetailsContext } from '../constants';
import { AuctionBiddingContext, DEFAULT_CONTEXT } from './constants';
import { BidTableData } from './types';

export const EditModal = () => {
	const format = useFormatter();

	const { auctionData } = useContext(AuctionDetailsContext);
	const {
		bids,
		bidsHandlers,
		editingBid,
		setEditingBid,
		editModalOpened,
		editModalActions,
		totalPermits,
	} = useContext(AuctionBiddingContext);

	const [subtotal, setSubtotal] = useState(0);

	const oldBid = useMemo(() => bids.find((bid) => bid.bid === editingBid), [bids, editingBid]);

	const form = useForm<BidTableData>({
		mode: 'uncontrolled',
		onValuesChange: ({ bid, permit }) => setSubtotal(Number(bid || 0) * Number(permit || 0)),
		validate: {
			permit: (value) => {
				const oldPermitValue = oldBid?.permit || 0;
				if (!value) return 'Permit is required';
				if (value < 1) return 'You must bid at least 1 permit';
				if (value > auctionData.permits) return 'You cannot bid more than permits offered';
				if (value - oldPermitValue > auctionData.permits - totalPermits)
					return `You cannot bid more than available permits. Please make sure to bid for less than or equal to ${auctionData.permits - totalPermits} permits`;
				return false;
			},
			bid: (value) => {
				if (!value) return 'Bid is required';
				if (value < 1) return 'Bid must be greater than 0';
				if (bids.some((bid) => bid.bid === value && bid.bid !== editingBid))
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

	useEffect(() => {
		form.setValues({
			permit: oldBid?.permit || 0,
			bid: oldBid?.bid || 0,
			emissions: oldBid?.emissions || 0,
			subtotal: oldBid?.subtotal || 0,
		});
	}, [oldBid]);

	const onEditHandler = useCallback(
		(values: BidTableData) => {
			console.log('values', values);
			bidsHandlers.applyWhere(
				(bid) => bid.bid === editingBid,
				() => values,
			);
			setEditingBid(DEFAULT_CONTEXT.editingBid);
			editModalActions.close();
			form.reset();
		},
		[bidsHandlers, editingBid],
	);

	return (
		<Modal title="Edit Bid" opened={editModalOpened} onClose={editModalActions.close} centered>
			<form onSubmit={form.onSubmit(onEditHandler)}>
				<NumberInput
					placeholder="000,000"
					min={1}
					max={auctionData.permits - totalPermits + (oldBid?.permit || 0)}
					label="Permits"
					name="permit"
					key={form.key('permit')}
					{...form.getInputProps('permit')}
				/>
				<NumberInput
					placeholder="Price per permit"
					leftSection={<CurrencyBadge />}
					min={1}
					label="Bid"
					name="bid"
					key={form.key('bid')}
					{...form.getInputProps('bid')}
				/>
				<Text>Total QAR {format.number(subtotal, 'money')}</Text>
				<Group>
					<Button onClick={editModalActions.close}>Cancel</Button>
					<Button color="green" type="submit">
						Save Changes
					</Button>
				</Group>
			</form>
		</Modal>
	);
};
