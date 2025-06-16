import { SingleAuctionContext } from 'contexts/SingleAuction';
import { useFormatter, useTranslations } from 'next-intl';
import { useCallback, useContext, useMemo, useState } from 'react';

import { CurrencyBadge } from '@/components/Badge';
import { useAuctionAvailability, useUnsavedChanges } from '@/hooks';
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
	const t = useTranslations();
	const format = useFormatter();
	const auction = useContext(SingleAuctionContext);
	const { bids, bidsHandlers, totalPermits } = useContext(AuctionDetailsPageContext);

	const { isUpcoming, hasEnded } = useAuctionAvailability();

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
				if (!value) return t('model.BiddingTableData.permit.required');
				if (value < 1) return t('model.BiddingTableData.permit.oneOrMore');
				if (value > auction.data.permits)
					return t('model.BiddingTableData.permit.moreThanOffered');
				if (value > auction.data.permits - totalPermits)
					return t('model.BiddingTableData.permit.moreThanAvailable');
				return false;
			},
			bid: (value) => {
				if (!value) return t('model.BiddingTableData.bid.required');
				if (value < 1) return t('model.BiddingTableData.bid.oneOrMore');
				//	TODO: add validation for min bid
				if (bids.some((bid) => bid.bid === value))
					return t('model.BiddingTableData.bid.exists');
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

	//	Stop user from leaving if he started bidding already
	useUnsavedChanges(form.isDirty() || bids.length > 0);

	return (
		<Stack className={classes.insertForm}>
			<Stack className={classes.header}>
				<Group className={classes.row}>
					<Title order={3} className={classes.title}>
						{t('marketplace.auction.details.bidding.sidebar.insertForm.title')}
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
					{t('marketplace.auction.details.bidding.sidebar.insertForm.description')}
				</Text>
			</Stack>
			{errorMessages.length > 0 && (
				<Alert
					variant="light"
					color="red"
					title={t('marketplace.auction.details.bidding.sidebar.insertForm.error.title')}
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
							<Text className={classes.label}>
								{t(
									'marketplace.auction.details.bidding.sidebar.insertForm.permit.label',
								)}
							</Text>
						</Group>
						<BiddingNumberInput
							placeholder="0"
							max={auction.data.permits - totalPermits}
							name="permit"
							key={form.key('permit')}
							disabled={!auction.data.hasJoined || isUpcoming || hasEnded}
							dark
							{...form.getInputProps('permit')}
						/>
					</Group>
					<Group className={classes.section}>
						<Group className={classes.key}>
							<IconLeaf size={16} className={classes.icon} />
							<Text className={classes.label}>
								{t(
									'marketplace.auction.details.bidding.sidebar.insertForm.emission.label',
								)}
							</Text>
						</Group>
						<Text className={classes.value}>
							{format.number(emissions)} {t('constants.emissions.unit')}
						</Text>
					</Group>
					<Group className={classes.section}>
						<Group className={classes.key}>
							<IconCoins size={16} className={classes.icon} />
							<Text className={classes.label}>
								{t(
									'marketplace.auction.details.bidding.sidebar.insertForm.bid.label',
								)}
							</Text>
						</Group>
						<BiddingNumberInput
							placeholder="0.00"
							name="bid"
							key={form.key('bid')}
							disabled={!auction.data.hasJoined || isUpcoming || hasEnded}
							decimalScale={2}
							fixedDecimalScale
							dark
							{...form.getInputProps('bid')}
						/>
					</Group>
				</Stack>
				<Stack className={classes.summary}>
					<Group className={classes.row}>
						<Text className={classes.text}>{t('constants.subtotal')}</Text>
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
						disabled={!auction.data.hasJoined || isUpcoming || hasEnded}
						leftSection={<IconArrowUpLeft size={16} />}
					>
						{t('marketplace.auction.details.bidding.sidebar.insertForm.add')}
					</Button>
					<Text className={classes.subtext}>
						{t('marketplace.auction.details.bidding.sidebar.insertForm.subtext')}
					</Text>
				</Stack>
			</form>
		</Stack>
	);
};
