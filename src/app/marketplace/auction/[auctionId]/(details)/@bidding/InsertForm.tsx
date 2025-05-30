import { useFormatter } from 'next-intl';
import { ComponentProps, useCallback, useContext, useMemo, useRef, useState } from 'react';

import { CurrencyBadge } from '@/components/Badge';
import { BidTableData } from '@/pages/marketplace/auction/[auctionId]/(details)/_components/BidTable';
import {
	AuctionBiddingContext,
	AuctionDetailsContext,
} from '@/pages/marketplace/auction/[auctionId]/(details)/_components/Providers';
import {
	ActionIcon,
	Alert,
	Button,
	Group,
	List,
	NumberInput,
	NumberInputHandlers,
	Stack,
	Text,
	Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useInterval, useTimeout } from '@mantine/hooks';
import {
	IconArrowUpLeft,
	IconCircleFilled,
	IconCoins,
	IconExclamationCircle,
	IconLeaf,
	IconLicense,
	IconMinus,
	IconPlus,
} from '@tabler/icons-react';

import classes from './styles.module.css';

export const InsertForm = () => {
	const format = useFormatter();
	const { auctionData } = useContext(AuctionDetailsContext);
	const { bids, bidsHandlers, totalPermits } = useContext(AuctionBiddingContext);

	const [subtotal, setSubtotal] = useState(0);
	const [emissions, setEmissions] = useState(0);

	const form = useForm<BidTableData>({
		mode: 'uncontrolled',
		onValuesChange: ({ bid, permit }) => {
			setSubtotal(Number(bid || 0) * Number(permit || 0));
			setEmissions(Number(permit || 0) * 1000);
		},
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
		[bidsHandlers, form, auctionData.hasJoined],
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
						<BidNumberInput
							placeholder="0"
							max={auctionData.permits - totalPermits}
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
						<BidNumberInput
							placeholder="0.00"
							name="bid"
							key={form.key('bid')}
							disabled={!auctionData.hasJoined}
							decimalScale={2}
							fixedDecimalScale
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
						variant="outline"
						type="submit"
						disabled={!auctionData.hasJoined}
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

const BidNumberInput = (props: ComponentProps<typeof NumberInput>) => {
	const ref = useRef<NumberInputHandlers>(null);

	const incrementInterval = useInterval(() => ref.current?.increment(), 50);
	const decrementInterval = useInterval(() => ref.current?.decrement(), 50);

	const handleHoldIncrement = useTimeout(() => incrementInterval.start(), 500);
	const handleHoldDecrement = useTimeout(() => decrementInterval.start(), 500);

	const handleStartIncrement = useCallback(() => {
		ref.current?.increment();
		handleHoldIncrement.start();
	}, [handleHoldIncrement]);
	const handleStartDecrement = useCallback(() => {
		ref.current?.decrement();
		handleHoldDecrement.start();
	}, [handleHoldDecrement]);

	const handleCancelIncrement = useCallback(() => {
		incrementInterval.stop();
		handleHoldIncrement.clear();
	}, [incrementInterval, handleHoldIncrement]);
	const handleCancelDecrement = useCallback(() => {
		decrementInterval.stop();
		handleHoldDecrement.clear();
	}, [decrementInterval, handleHoldDecrement]);

	return (
		<NumberInput
			classNames={{
				root: classes.numberInput,
				wrapper: classes.wrapper,
				input: classes.input,
				section: classes.section,
				error: 'hidden',
			}}
			min={1}
			thousandSeparator=" "
			thousandsGroupStyle="thousand"
			leftSection={
				<ActionIcon
					onMouseDown={handleStartDecrement}
					onMouseUp={handleCancelDecrement}
					onMouseLeave={handleCancelDecrement}
					disabled={props.disabled}
				>
					<IconMinus size={16} />
				</ActionIcon>
			}
			rightSection={
				<ActionIcon
					onMouseDown={handleStartIncrement}
					onMouseUp={handleCancelIncrement}
					onMouseLeave={handleCancelIncrement}
					disabled={props.disabled}
				>
					<IconPlus size={16} />
				</ActionIcon>
			}
			handlersRef={ref}
			{...props}
		/>
	);
};
