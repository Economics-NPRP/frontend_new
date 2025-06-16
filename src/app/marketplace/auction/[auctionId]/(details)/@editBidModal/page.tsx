'use client';

import { SingleAuctionContext } from 'contexts/SingleAuction';
import { useFormatter, useTranslations } from 'next-intl';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { CurrencyBadge } from '@/components/Badge';
import { BiddingNumberInput } from '@/pages/marketplace/auction/[auctionId]/(details)/_components/BiddingNumberInput';
import { BiddingTableData } from '@/pages/marketplace/auction/[auctionId]/(details)/_components/BiddingTable';
import {
	AuctionDetailsPageContext,
	DefaultAuctionDetailsPageContextData,
} from '@/pages/marketplace/auction/[auctionId]/(details)/_components/Providers';
import { Alert, Button, Group, List, Modal, Stack, Text, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconCoins, IconExclamationCircle, IconLeaf, IconLicense } from '@tabler/icons-react';

import classes from './styles.module.css';

export default function EditModal() {
	const t = useTranslations();
	const format = useFormatter();

	const auction = useContext(SingleAuctionContext);
	const {
		bids,
		bidsHandlers,
		editingBid,
		setEditingBid,
		editModalOpened,
		editModalActions,
		totalPermits,
	} = useContext(AuctionDetailsPageContext);

	const [subtotal, setSubtotal] = useState(0);
	const [emissions, setEmissions] = useState(0);

	const oldBid = useMemo(() => bids.find((bid) => bid.bid === editingBid), [bids, editingBid]);

	const form = useForm<BiddingTableData>({
		mode: 'uncontrolled',
		onValuesChange: ({ bid, permit }) => {
			setSubtotal(Number(bid || 0) * Number(permit || 0));
			setEmissions(Number(permit || 0) * 1000);
		},
		validate: {
			permit: (value) => {
				const oldPermitValue = oldBid?.permit || 0;
				if (!value) return t('model.BiddingTableData.permit.required');
				if (value < 1) return t('model.BiddingTableData.permit.oneOrMore');
				if (value > auction.data.permits)
					return t('model.BiddingTableData.permit.moreThanOffered');
				if (value - oldPermitValue > auction.data.permits - totalPermits)
					return t('model.BiddingTableData.permit.moreThanAvailableWithValue', {
						value: auction.data.permits - totalPermits,
					});
				return false;
			},
			bid: (value) => {
				if (!value) return t('model.BiddingTableData.bid.required');
				if (value < 1) return t('model.BiddingTableData.bid.oneOrMore');
				//	TODO: add validation for min bid
				if (bids.some((bid) => bid.bid === value && bid.bid !== editingBid))
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

	useEffect(() => {
		form.setValues({
			permit: oldBid?.permit || 0,
			bid: oldBid?.bid || 0,
			emissions: oldBid?.emissions || 0,
			subtotal: oldBid?.subtotal || 0,
		});
	}, [oldBid]);

	const onEditHandler = useCallback(
		(values: BiddingTableData) => {
			bidsHandlers.applyWhere(
				(bid) => bid.bid === editingBid,
				() => values,
			);
			setEditingBid(DefaultAuctionDetailsPageContextData.editingBid);
			editModalActions.close();
			form.reset();
		},
		[bidsHandlers, editingBid],
	);

	const errorMessages = useMemo(
		() =>
			Object.values(form.errors).map((error, index) => (
				<List.Item key={index}>{error}</List.Item>
			)),
		[form.errors],
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
				{t('marketplace.auction.details.editBidModal.title')}
			</Title>
			<Text className={classes.description}>
				{t('marketplace.auction.details.editBidModal.description')}
			</Text>
			{errorMessages.length > 0 && (
				<Alert
					variant="light"
					color="red"
					title={t('marketplace.auction.details.editBidModal.error.title')}
					icon={<IconExclamationCircle />}
					className={classes.error}
				>
					<List className={classes.list}>{errorMessages}</List>
				</Alert>
			)}
			<form onSubmit={form.onSubmit(onEditHandler)}>
				<Stack className={classes.inputs}>
					<Group className={classes.section}>
						<Group className={classes.key}>
							<IconLicense size={16} className={classes.icon} />
							<Text className={classes.label}>
								{t.rich('marketplace.auction.details.editBidModal.permit.label', {
									value: oldBid?.permit || 0,
									b: (chunks) => <b>{chunks}</b>,
								})}
							</Text>
						</Group>
						<BiddingNumberInput
							placeholder="0"
							max={auction.data.permits - totalPermits + (oldBid?.permit || 0)}
							name="permit"
							key={form.key('permit')}
							disabled={!auction.data.hasJoined}
							{...form.getInputProps('permit')}
						/>
					</Group>
					<Group className={classes.section}>
						<Group className={classes.key}>
							<IconLeaf size={16} className={classes.icon} />
							<Text className={classes.label}>
								{t.rich('marketplace.auction.details.editBidModal.emission.label', {
									value: oldBid?.emissions || 0,
									b: (chunks) => <b>{chunks}</b>,
								})}
							</Text>
						</Group>
						<Text className={classes.value}>{format.number(emissions)} tCO2e</Text>
					</Group>
					<Group className={classes.section}>
						<Group className={classes.key}>
							<IconCoins size={16} className={classes.icon} />
							<Text className={classes.label}>
								{t.rich('marketplace.auction.details.editBidModal.bid.label', {
									value: oldBid?.bid || 0,
									b: (chunks) => <b>{chunks}</b>,
								})}
							</Text>
						</Group>
						<BiddingNumberInput
							placeholder="0.00"
							name="bid"
							key={form.key('bid')}
							disabled={!auction.data.hasJoined}
							decimalScale={2}
							fixedDecimalScale
							{...form.getInputProps('bid')}
						/>
					</Group>
					<Group className={classes.summary}>
						<Text className={classes.text}>{t('constants.subtotal')}</Text>
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
						className={`${classes.secondary} ${classes.button}`}
						variant="outline"
						onClick={editModalActions.close}
					>
						{t('constants.actions.cancel.label')}
					</Button>
					<Button className={`${classes.primary} ${classes.button}`} type="submit">
						{t('constants.actions.saveChanges.label')}
					</Button>
				</Group>
			</form>
		</Modal>
	);
}
