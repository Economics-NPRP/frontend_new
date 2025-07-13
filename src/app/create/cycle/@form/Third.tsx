'use client';

import { useFormatter, useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { useContextSelector } from 'use-context-selector';

import { CurrencyBadge } from '@/components/Badge';
import { CreateLayoutContext } from '@/pages/create/_components/Providers';
import { ICreateCycleStepProps } from '@/pages/create/cycle/@form/page';
import {
	ActionIcon,
	Alert,
	Button,
	Container,
	Divider,
	Group,
	List,
	NumberInput,
	NumberInputProps,
	Stack,
	Text,
	Title,
	Tooltip,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
	IconBolt,
	IconBuildingCommunity,
	IconBuildingFactory,
	IconDownload,
	IconExclamationCircle,
	IconFileImport,
	IconInfoCircle,
	IconLeaf,
	IconRecycle,
	IconTruck,
} from '@tabler/icons-react';

import classes from './styles.module.css';

export const ThirdStep = ({ disabled }: ICreateCycleStepProps) => {
	const t = useTranslations();
	const formError = useContextSelector(CreateLayoutContext, (context) => context.formError);
	const setFormError = useContextSelector(CreateLayoutContext, (context) => context.setFormError);

	return (
		<Stack className={`${classes.third} ${classes.root}`}>
			<Stack className={classes.header}>
				<Title order={2} className={classes.heading}>
					{t('create.cycle.third.header.heading')}
				</Title>
				<Text className={classes.subheading}>
					{t('create.cycle.third.header.subheading')}
				</Text>
				<Group className={classes.actions}>
					{/* TODO: implement import/export functionality */}
					<Button
						className={classes.button}
						leftSection={<IconFileImport size={16} />}
						variant="light"
					>
						{t('constants.actions.importFromCSV.label')}
					</Button>
					<Button
						className={classes.button}
						leftSection={<IconDownload size={16} />}
						variant="light"
					>
						{t('constants.download.default')}
					</Button>
				</Group>
			</Stack>
			{formError.length > 0 && (
				<Alert
					variant="light"
					color="red"
					title={t('create.cycle.error.title')}
					icon={<IconExclamationCircle />}
					className={classes.alert}
					withCloseButton
					onClose={() => setFormError([])}
				>
					<List>{formError}</List>
				</Alert>
			)}
			<Container className={classes.table}>
				<Group className={`${classes.energy} ${classes.cell}`}>
					<IconBolt size={16} className={classes.icon} />
					<Text className={classes.label}>{t('constants.sector.energy.title')}</Text>
				</Group>
				<Group className={`${classes.industry} ${classes.cell}`}>
					<IconBuildingFactory size={16} className={classes.icon} />
					<Text className={classes.label}>{t('constants.sector.industry.title')}</Text>
				</Group>
				<Group className={`${classes.transport} ${classes.cell}`}>
					<IconTruck size={16} className={classes.icon} />
					<Text className={classes.label}>{t('constants.sector.transport.title')}</Text>
				</Group>
				<Group className={`${classes.buildings} ${classes.cell}`}>
					<IconBuildingCommunity size={16} className={classes.icon} />
					<Text className={classes.label}>{t('constants.sector.buildings.title')}</Text>
				</Group>
				<Group className={`${classes.agriculture} ${classes.cell}`}>
					<IconLeaf size={16} className={classes.icon} />
					<Text className={classes.label}>{t('constants.sector.agriculture.title')}</Text>
				</Group>
				<Group className={`${classes.waste} ${classes.cell}`}>
					<IconRecycle size={16} className={classes.icon} />
					<Text className={classes.label}>{t('constants.sector.waste.title')}</Text>
				</Group>
				<Group className={`${classes.summary} ${classes.cell}`}>
					<Text className={classes.label}>
						{t('create.cycle.third.table.summary.header')}
					</Text>
				</Group>
				<TargetSection
					title={t('create.cycle.third.permitDistribution.title')}
					rows={[
						{
							label: t('create.cycle.third.permitDistribution.totalAuctions.label'),
							tooltip: t(
								'create.cycle.third.permitDistribution.totalAuctions.tooltip',
							),
							summary: 'total',
							unit: 'auctions',
						},
						{
							label: t('create.cycle.third.permitDistribution.totalPermits.label'),
							tooltip: t(
								'create.cycle.third.permitDistribution.totalPermits.tooltip',
							),
							summary: 'total',
							unit: 'permits',
						},
						{
							label: t('create.cycle.third.permitDistribution.avgPerAuction.label'),
							tooltip: t(
								'create.cycle.third.permitDistribution.avgPerAuction.tooltip',
							),
							summary: 'average',
							unit: 'permits',
						},
						{
							label: t('create.cycle.third.permitDistribution.avgFree.label'),
							tooltip: t('create.cycle.third.permitDistribution.avgFree.tooltip'),
							summary: 'average',
							unit: 'permits',
						},
						{
							label: t('create.cycle.third.permitDistribution.avgWon.label'),
							tooltip: t('create.cycle.third.permitDistribution.avgWon.tooltip'),
							summary: 'average',
							unit: 'permits',
						},
					]}
					disabled={disabled}
				/>
				<TargetSection
					title={t('create.cycle.third.financial.title')}
					rows={[
						{
							label: t('create.cycle.third.financial.revenue.label'),
							tooltip: t('create.cycle.third.financial.revenue.tooltip'),
							summary: 'total',
							unit: 'currency',
						},
						{
							label: t('create.cycle.third.financial.avgWinningBid.label'),
							tooltip: t('create.cycle.third.financial.avgWinningBid.tooltip'),
							summary: 'average',
							unit: 'currency',
						},
						{
							label: t('create.cycle.third.financial.avgTotalPayment.label'),
							tooltip: t('create.cycle.third.financial.avgTotalPayment.tooltip'),
							summary: 'average',
							unit: 'currency',
						},
					]}
					disabled={disabled}
				/>
				<TargetSection
					title={t('create.cycle.third.participation.title')}
					rows={[
						{
							label: t('create.cycle.third.participation.totalFirms.label'),
							tooltip: t('create.cycle.third.participation.totalFirms.tooltip'),
							summary: 'total',
							unit: 'firms',
						},
						{
							label: t('create.cycle.third.participation.avgJoinedAuctions.label'),
							tooltip: t(
								'create.cycle.third.participation.avgJoinedAuctions.tooltip',
							),
							summary: 'average',
							unit: 'auctions',
						},
						{
							label: t('create.cycle.third.participation.percentWinners.label'),
							tooltip: t('create.cycle.third.participation.percentWinners.tooltip'),
							summary: 'average',
							unit: 'percentage',
						},
						{
							label: t('create.cycle.third.participation.percentWinning.label'),
							tooltip: t('create.cycle.third.participation.percentWinning.tooltip'),
							summary: 'average',
							unit: 'percentage',
						},
						{
							label: t('create.cycle.third.participation.avgBidsAuction.label'),
							tooltip: t('create.cycle.third.participation.avgBidsAuction.tooltip'),
							summary: 'average',
							unit: 'bids',
						},
						{
							label: t('create.cycle.third.participation.avgBidsFirm.label'),
							tooltip: t('create.cycle.third.participation.avgBidsFirm.tooltip'),
							summary: 'average',
							unit: 'bids',
						},
					]}
					disabled={disabled}
				/>
				<TargetSection
					title={t('create.cycle.third.longTerm.title')}
					rows={[
						{
							label: t('create.cycle.third.longTerm.holdingTime.label'),
							tooltip: t('create.cycle.third.longTerm.holdingTime.tooltip'),
							summary: 'average',
							unit: 'days',
						},
						{
							label: t('create.cycle.third.longTerm.percentCarryOver.label'),
							tooltip: t('create.cycle.third.longTerm.percentCarryOver.tooltip'),
							summary: 'average',
							unit: 'percentage',
						},
						{
							label: t('create.cycle.third.longTerm.percentResold.label'),
							tooltip: t('create.cycle.third.longTerm.percentResold.tooltip'),
							summary: 'average',
							unit: 'percentage',
						},
						{
							label: t('create.cycle.third.longTerm.expiryRate.label'),
							tooltip: t('create.cycle.third.longTerm.expiryRate.tooltip'),
							summary: 'average',
							unit: 'percentage',
						},
					]}
					disabled={disabled}
				/>
			</Container>
		</Stack>
	);
};

interface TargetSectionProps {
	title: string;
	rows: Array<TargetRowProps>;
	disabled?: boolean;
}
const TargetSection = ({ title, rows, disabled }: TargetSectionProps) => {
	const rowElements = useMemo(
		() =>
			rows.map((props, index) => (
				<>
					<TargetRow key={index} disabled={disabled} {...props} />
					{index < rows.length - 1 && (
						<Divider key={`divider_${index}`} className={classes.divider} />
					)}
				</>
			)),
		[rows],
	);

	return (
		<Stack className={classes.section}>
			<Text className={classes.title}>{title}</Text>
			<Stack className={classes.rows}>{rowElements}</Stack>
		</Stack>
	);
};

interface TargetRowProps extends NumberInputProps {
	label: string;
	tooltip: string;
	summary: 'total' | 'average';
	unit:
		| 'currency'
		| 'percentage'
		| 'integer'
		| 'double'
		| 'index'
		| 'permits'
		| 'bids'
		| 'firms'
		| 'auctions'
		| 'days';
}
const TargetRow = ({ label, tooltip, summary, unit, key, ...props }: TargetRowProps) => {
	const t = useTranslations();
	const format = useFormatter();
	const [summaryValue, setSummaryValue] = useState(0);

	const form = useForm({
		mode: 'uncontrolled',
		onValuesChange: (values) => {
			if (summary === 'total') {
				const total = Object.values(values).reduce((acc, value) => acc + (value || 0), 0);
				setSummaryValue(total);
			} else if (summary === 'average') {
				const total = Object.values(values).reduce((acc, value) => acc + (value || 0), 0);
				const count = Object.keys(values).length;
				setSummaryValue(count > 0 ? total / count : 0);
			}
		},
	});

	const summaryElement = useMemo(() => {
		switch (unit) {
			case 'currency':
				return (
					<>
						<CurrencyBadge />
						<Text className={classes.amount}>
							{format.number(summaryValue, 'money')}
						</Text>
					</>
				);
			case 'percentage':
				return (
					<Text className={classes.amount}>
						{t('constants.quantities.percent.default', { value: summaryValue })}
					</Text>
				);
			case 'integer':
				return (
					<Text className={classes.amount}>
						{format.number(Math.round(summaryValue))}
					</Text>
				);
			case 'double':
				return (
					<Text className={classes.amount}>{format.number(summaryValue, 'money')}</Text>
				);
			case 'index':
				return (
					<Text className={classes.amount}>{format.number(summaryValue, 'index')}</Text>
				);
			case 'permits':
				return (
					<>
						<Text className={classes.amount}>
							{format.number(
								summaryValue,
								summary === 'average' ? 'money' : undefined,
							)}
						</Text>
						<Text className={classes.unit}>{t('constants.permits.unitShort')}</Text>
					</>
				);
			case 'bids':
				return (
					<>
						<Text className={classes.amount}>
							{format.number(
								summaryValue,
								summary === 'average' ? 'money' : undefined,
							)}
						</Text>
						<Text className={classes.unit}>{t('constants.bids.unit')}</Text>
					</>
				);
			case 'firms':
				return (
					<>
						<Text className={classes.amount}>
							{format.number(
								summaryValue,
								summary === 'average' ? 'money' : undefined,
							)}
						</Text>
						<Text className={classes.unit}>{t('constants.firms.unit')}</Text>
					</>
				);
			case 'auctions':
				return (
					<>
						<Text className={classes.amount}>
							{format.number(
								summaryValue,
								summary === 'average' ? 'money' : undefined,
							)}
						</Text>
						<Text className={classes.unit}>{t('constants.auctions.unit')}</Text>
					</>
				);
			case 'days':
				return (
					<>
						<Text className={classes.amount}>
							{format.number(
								summaryValue,
								summary === 'average' ? 'money' : undefined,
							)}
						</Text>
						<Text className={classes.unit}>{t('constants.days.unit')}</Text>
					</>
				);
		}
	}, [unit, summary, summaryValue, format, t]);

	return (
		<Group key={key} className={classes.row}>
			<Group className={classes.label}>
				<Text className={classes.text} title={label}>
					{label}
				</Text>
				<Tooltip label={tooltip} position="top">
					<ActionIcon variant="subtle" className={classes.help}>
						<IconInfoCircle size={14} />
					</ActionIcon>
				</Tooltip>
			</Group>
			<NumberInput
				classNames={{
					root: `${classes.energy} ${classes.value}`,
					wrapper: classes.wrapper,
					input: classes.input,
				}}
				placeholder="0"
				hideControls
				thousandSeparator=" "
				thousandsGroupStyle="thousand"
				key={form.key('energy')}
				{...form.getInputProps('energy')}
				{...props}
			/>
			<NumberInput
				classNames={{
					root: `${classes.industry} ${classes.value}`,
					wrapper: classes.wrapper,
					input: classes.input,
				}}
				placeholder="0"
				hideControls
				thousandSeparator=" "
				thousandsGroupStyle="thousand"
				key={form.key('industry')}
				{...form.getInputProps('industry')}
				{...props}
			/>
			<NumberInput
				classNames={{
					root: `${classes.transport} ${classes.value}`,
					wrapper: classes.wrapper,
					input: classes.input,
				}}
				placeholder="0"
				hideControls
				thousandSeparator=" "
				thousandsGroupStyle="thousand"
				key={form.key('transport')}
				{...form.getInputProps('transport')}
				{...props}
			/>
			<NumberInput
				classNames={{
					root: `${classes.buildings} ${classes.value}`,
					wrapper: classes.wrapper,
					input: classes.input,
				}}
				placeholder="0"
				hideControls
				thousandSeparator=" "
				thousandsGroupStyle="thousand"
				key={form.key('buildings')}
				{...form.getInputProps('buildings')}
				{...props}
			/>
			<NumberInput
				classNames={{
					root: `${classes.agriculture} ${classes.value}`,
					wrapper: classes.wrapper,
					input: classes.input,
				}}
				placeholder="0"
				hideControls
				thousandSeparator=" "
				thousandsGroupStyle="thousand"
				key={form.key('agriculture')}
				{...form.getInputProps('agriculture')}
				{...props}
			/>
			<NumberInput
				classNames={{
					root: `${classes.waste} ${classes.value}`,
					wrapper: classes.wrapper,
					input: classes.input,
				}}
				placeholder="0"
				hideControls
				thousandSeparator=" "
				thousandsGroupStyle="thousand"
				key={form.key('waste')}
				{...form.getInputProps('waste')}
				{...props}
			/>
			<Group className={`${classes.summary} ${classes.value}`}>{summaryElement}</Group>
		</Group>
	);
};
