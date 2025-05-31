import { SingleAuctionContext } from 'contexts/SingleAuction';
import { useFormatter } from 'next-intl';
import { useCallback, useContext, useMemo, useState } from 'react';

import { CurrencyBadge } from '@/components/Badge';
import { BiddingNumberInput } from '@/pages/marketplace/auction/[auctionId]/(details)/_components/BiddingNumberInput';
import { BiddingTableData } from '@/pages/marketplace/auction/[auctionId]/(details)/_components/BiddingTable';
import { AuctionDetailsPageContext } from '@/pages/marketplace/auction/[auctionId]/(details)/_components/Providers';
import { Alert, Button, Group, List, Stack, Text, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import {
	IconArrowUpLeft,
	IconCircleFilled,
	IconCoins,
	IconExclamationCircle,
	IconLeaf,
	IconLicense,
} from '@tabler/icons-react';

import classes from './styles.module.css';

export const InsertForm = () => {
	const format = useFormatter();
	const auction = useContext(SingleAuctionContext);
	const { bids, bidsHandlers, totalPermits } = useContext(AuctionDetailsPageContext);

	const [subtotal, setSubtotal] = useState(0);
	const [emissions, setEmissions] = useState(0);

	const form = useForm<BiddingTableData>({
		mode: 'uncontrolled',
		onValuesChange: ({ bid, permit }) => {
			setSubtotal(Number(bid || 0) * Number(permit || 0));
			setEmissions(Number(permit || 0) * 1000);
		},
		validate: {
			permit: (value) => {
				if (!value) return 'Permit is required';
				if (value < 1) return 'You must bid at least 1 permit';
				if (value > auction.data.permits) return 'You cannot bid more than permits offered';
				if (value > auction.data.permits - totalPermits)
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
		(values: BiddingTableData) => {
			if (!auction.data.hasJoined) return;
			bidsHandlers.append(values);
			form.reset();
		},
		[bidsHandlers, form, auction.data.hasJoined],
	);

	return (
		<Stack className={classes.insertForm}>
			<Stack className={classes.header}>
				<Group className={classes.row}>
					<Title order={3} className={classes.title}>
						Insert Bids
					</Title>
					<Group className={classes.dots}>
						<IconCircleFilled size={6} />
						<IconCircleFilled size={6} />
						<IconCircleFilled size={6} />
						<IconCircleFilled size={6} />
						<IconCircleFilled size={6} />
					</Group>
				</Group>
				<Text className={classes.description}>
					Insert your bids to the bidding table using the form below
				</Text>
			</Stack>
			{errorMessages.length > 0 && (
				<Alert
					variant="light"
					color="red"
					title="There was a problem adding your bid"
					icon={<IconExclamationCircle />}
					className={classes.error}
				>
					<List className={classes.list}>{errorMessages}</List>
				</Alert>
			)}
			<form onSubmit={form.onSubmit(onSubmitHandler)}>
				<Stack className={classes.inputs}>
					<Group className={classes.section}>
						<Group className={classes.key}>
							<IconLicense size={16} className={classes.icon} />
							<Text className={classes.label}>Permits to Bid</Text>
						</Group>
						<BiddingNumberInput
							placeholder="0"
							max={auction.data.permits - totalPermits}
							name="permit"
							key={form.key('permit')}
							disabled={!auction.data.hasJoined}
							dark
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
							disabled={!auction.data.hasJoined}
							decimalScale={2}
							fixedDecimalScale
							dark
							{...form.getInputProps('bid')}
						/>
					</Group>
				</Stack>
				<Stack className={classes.summary}>
					<Group className={classes.row}>
						<Text className={classes.text}>Subtotal</Text>
						<Group className={classes.cell}>
							<CurrencyBadge className={classes.badge} />
							<Text className={classes.value}>
								{format.number(subtotal, 'money')}
							</Text>
						</Group>
					</Group>
					<Button
						className={classes.button}
						type="submit"
						disabled={!auction.data.hasJoined}
						leftSection={<IconArrowUpLeft size={16} />}
					>
						Add to Table
					</Button>
					<Text className={classes.subtext}>
						Pressing the above button will not submit your bid. It will only add it to
						the table on the left
					</Text>
				</Stack>
			</form>
		</Stack>
	);
};
