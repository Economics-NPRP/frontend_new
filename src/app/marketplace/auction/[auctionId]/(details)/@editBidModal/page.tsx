'use client';

import { useFormatter } from 'next-intl';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { CurrencyBadge } from '@/components/Badge';
import { BidTableData } from '@/pages/marketplace/auction/[auctionId]/(details)/_components/BidTable';
import { BiddingNumberInput } from '@/pages/marketplace/auction/[auctionId]/(details)/_components/BiddingNumberInput';
import {
	AuctionBiddingContext,
	AuctionDetailsContext,
	DEFAULT_AUCTION_BIDDING_CONTEXT,
} from '@/pages/marketplace/auction/[auctionId]/(details)/_components/Providers';
import { Button, Group, Modal, Stack, Text, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconArrowUpLeft, IconCoins, IconLeaf, IconLicense } from '@tabler/icons-react';

import classes from './styles.module.css';

export default function EditModal() {
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
	const [emissions, setEmissions] = useState(0);

	const oldBid = useMemo(() => bids.find((bid) => bid.bid === editingBid), [bids, editingBid]);

	const form = useForm<BidTableData>({
		mode: 'uncontrolled',
		onValuesChange: ({ bid, permit }) => {
			setSubtotal(Number(bid || 0) * Number(permit || 0));
			setEmissions(Number(permit || 0) * 1000);
		},
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
			bidsHandlers.applyWhere(
				(bid) => bid.bid === editingBid,
				() => values,
			);
			setEditingBid(DEFAULT_AUCTION_BIDDING_CONTEXT.editingBid);
			editModalActions.close();
			form.reset();
		},
		[bidsHandlers, editingBid],
	);

	return (
		<Modal
			opened={editModalOpened}
			onClose={editModalActions.close}
			withCloseButton={false}
			classNames={{
				root: classes.root,
				inner: classes.inner,
				content: classes.content,
				body: classes.body,
			}}
			centered
		>
			<Title order={2} className={classes.title}>
				Edit Your Bid
			</Title>
			<Text className={classes.description}>
				You can edit your bid by changing the number of permits and the price per permit.
				Please ensure that your new bid does not exceed the available permits.
			</Text>
			<form onSubmit={form.onSubmit(onEditHandler)}>
				<Stack className={classes.inputs}>
					<Group className={classes.section}>
						<Group className={classes.key}>
							<IconLicense size={16} className={classes.icon} />
							<Text className={classes.label}>Permits to Bid</Text>
						</Group>
						<BiddingNumberInput
							placeholder="0"
							max={auctionData.permits - totalPermits + (oldBid?.permit || 0)}
							name="permit"
							key={form.key('permit')}
							disabled={!auctionData.hasJoined}
							{...form.getInputProps('permit')}
						/>
					</Group>
					<Group className={classes.section}>
						<Group className={classes.key}>
							<IconLeaf size={16} className={classes.icon} />
							<Text className={classes.label}>Total Emissions</Text>
						</Group>
						<Text className={classes.value}>{format.number(emissions)} tCO2e</Text>
					</Group>
					<Group className={classes.section}>
						<Group className={classes.key}>
							<IconCoins size={16} className={classes.icon} />
							<Text className={classes.label}>Price per Permit</Text>
						</Group>
						<BiddingNumberInput
							placeholder="0.00"
							name="bid"
							key={form.key('bid')}
							disabled={!auctionData.hasJoined}
							decimalScale={2}
							fixedDecimalScale
							{...form.getInputProps('bid')}
						/>
					</Group>
					<Group className={classes.summary}>
						<Text className={classes.text}>Subtotal</Text>
						<Group className={classes.cell}>
							<CurrencyBadge />
							<Text className={classes.value}>
								{format.number(subtotal, 'money')}
							</Text>
						</Group>
					</Group>
				</Stack>
				<Group className={classes.actions}>
					<Button
						className={classes.button}
						variant="outline"
						onClick={editModalActions.close}
					>
						Cancel
					</Button>
					<Button className={classes.button} type="submit">
						Save Changes
					</Button>
				</Group>
			</form>
		</Modal>
	);
}
