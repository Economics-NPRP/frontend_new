import { PaginatedAuctionsContext } from 'contexts/PaginatedAuctions';
import { useTranslations } from 'next-intl';
import { useCallback, useContext, useEffect, useMemo } from 'react';

import {
	Accordion,
	AccordionControl,
	AccordionItem,
	AccordionPanel,
	ActionIcon,
	Anchor,
	Button,
	Checkbox,
	Container,
	Divider,
	Group,
	LoadingOverlay,
	Modal,
	Radio,
	RadioGroup,
	RangeSlider,
	RangeSliderValue,
	Stack,
	Text,
	TextInput,
	Title,
	Tooltip,
} from '@mantine/core';
import { DatePickerInput, DatesRangeValue } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { IconArrowBackUp, IconCheck, IconPlus, IconTrash, IconX } from '@tabler/icons-react';

import { AuctionCatalogueContext, IAuctionFilters } from './constants';
import classes from './styles.module.css';

const MIN_PERMITS = 1;
const MAX_PERMITS = 99999;
const MIN_BID = 1;
const MAX_BID = 999999;
const MIN_PRICE = 1;
const MAX_PRICE = 999999;

//	TODO: use valibot schemas for transformations

const parseFilters = (filters: IAuctionFilters) => ({
	...filters,
	sector: {
		energy: filters.sector?.includes('energy') || false,
		industry: filters.sector?.includes('industry') || false,
		transport: filters.sector?.includes('transport') || false,
		buildings: filters.sector?.includes('buildings') || false,
		agriculture: filters.sector?.includes('agriculture') || false,
		waste: filters.sector?.includes('waste') || false,
	},
});

const parseCheckboxes = (values: Record<string, unknown>) =>
	Object.entries(values)
		.filter(([, value]) => value)
		.map(([key]) => key);
const parseDatePicker = (value: DatesRangeValue | undefined) =>
	value ? (value[0] === null && value[1] === null ? undefined : value) : undefined;
const parseRange = (value: RangeSliderValue | undefined, min: number, max: number) =>
	value ? (value[0] === min && value[1] === max ? undefined : value) : undefined;
const parseValues = (values: ReturnType<typeof parseFilters>) =>
	({
		type: values.type,
		status: values.status,
		sector: parseCheckboxes(values.sector),
		joined: values.joined,
		ownership: values.ownership,
		//	TODO: Add owner filter
		date: parseDatePicker(values.date),
		permits: parseRange(values.permits, MIN_PERMITS, MAX_PERMITS),
		minBid: parseRange(values.minBid, MIN_BID, MAX_BID),
		price: parseRange(values.price, MIN_PRICE, MAX_PRICE),
	}) as IAuctionFilters;

const FiltersCore = () => {
	const t = useTranslations();
	const paginatedAuctions = useContext(PaginatedAuctionsContext);

	const form = useForm({
		mode: 'uncontrolled',
		initialValues: parseFilters(paginatedAuctions.filters),

		transformValues: parseValues,
	});

	useEffect(() => {
		form.setInitialValues(parseFilters(paginatedAuctions.filters));
		form.reset();
	}, [paginatedAuctions.filters]);

	const handleClearFilters = useCallback(
		() => paginatedAuctions.setAllFilters({}),
		[paginatedAuctions.setAllFilters],
	);

	const numFilters = useMemo(() => {
		const type = paginatedAuctions.filters.type ? 1 : 0;
		const status = paginatedAuctions.filters.status === 'all' ? 0 : 1;
		const sector = paginatedAuctions.filters.sector?.length || 0;
		const joined = paginatedAuctions.filters.joined ? 1 : 0;
		const ownership = paginatedAuctions.filters.ownership ? 1 : 0;
		const date = paginatedAuctions.filters.date ? 1 : 0;
		const permits = paginatedAuctions.filters.permits ? 1 : 0;
		const minBid = paginatedAuctions.filters.minBid ? 1 : 0;
		const price = paginatedAuctions.filters.price ? 1 : 0;
		const total = type + status + sector + joined + ownership + date + permits + minBid + price;

		return {
			type,
			status,
			sector,
			joined,
			ownership,
			date,
			permits,
			minBid,
			price,
			total,
		};
	}, [paginatedAuctions.filters]);

	return (
		<Container
			className={`${classes.wrapper} ${paginatedAuctions.isFetching ? classes.loading : ''}`}
		>
			<form onSubmit={form.onSubmit((value) => paginatedAuctions.setAllFilters(value))}>
				<LoadingOverlay visible={paginatedAuctions.isFetching} />
				<Group className={classes.footer}>
					<Text className={classes.value}>
						{t('marketplace.home.catalogue.filters.total', {
							value: numFilters.total,
						})}
					</Text>
					<Group className={classes.actions}>
						<Tooltip label={t('marketplace.home.catalogue.filters.clear.tooltip')}>
							<ActionIcon
								className={`${classes.action} ${classes.square}`}
								onClick={handleClearFilters}
							>
								<IconTrash size={16} />
							</ActionIcon>
						</Tooltip>
						<Tooltip label={t('marketplace.home.catalogue.filters.reset.tooltip')}>
							<ActionIcon
								className={`${classes.action} ${classes.square}`}
								onClick={form.reset}
							>
								<IconArrowBackUp size={16} />
							</ActionIcon>
						</Tooltip>
						<Tooltip label={t('marketplace.home.catalogue.filters.apply.tooltip')}>
							<Button
								className={classes.action}
								type="submit"
								rightSection={<IconCheck size={16} />}
							>
								{t('marketplace.home.catalogue.filters.apply.label')}
							</Button>
						</Tooltip>
					</Group>
				</Group>
				<Divider />
				<Accordion
					classNames={{
						root: classes.accordion,
						chevron: classes.chevron,
						content: classes.content,
					}}
					defaultValue={['type', 'status', 'sector']}
					chevron={<IconPlus size={16} />}
					multiple
				>
					<AccordionItem value={'type'}>
						<AccordionControl classNames={{ label: classes.title }}>
							{t('marketplace.home.catalogue.filters.accordion.type.title')}
							<Text className={classes.subtitle}>
								{t('marketplace.home.catalogue.filters.count', {
									value: numFilters.type,
								})}
							</Text>
						</AccordionControl>
						<AccordionPanel>
							<Text className={classes.description}>
								{t.rich(
									'marketplace.home.catalogue.filters.accordion.type.description',
									{ a: (chunks) => <Anchor href="#">{chunks}</Anchor> },
								)}
							</Text>
							<RadioGroup key={form.key('type')} {...form.getInputProps('type')}>
								<Container className={classes.values}>
									<Radio
										className={classes.checkbox}
										label={t('constants.auctionType.open')}
										value="open"
									/>
									<Radio
										className={classes.checkbox}
										label={t('constants.auctionType.sealed')}
										value="sealed"
									/>
									<Radio
										className={classes.checkbox}
										label={t('marketplace.home.catalogue.filters.all')}
										value="all"
									/>
								</Container>
							</RadioGroup>
						</AccordionPanel>
					</AccordionItem>
					<AccordionItem value={'status'}>
						<AccordionControl classNames={{ label: classes.title }}>
							{t('marketplace.home.catalogue.filters.accordion.status.title')}
							<Text className={classes.subtitle}>
								{t('marketplace.home.catalogue.filters.count', {
									value: numFilters.status,
								})}
							</Text>
						</AccordionControl>
						<AccordionPanel>
							<Text className={classes.description}>
								{t(
									'marketplace.home.catalogue.filters.accordion.status.description',
								)}
							</Text>
							<RadioGroup key={form.key('status')} {...form.getInputProps('status')}>
								<Container className={classes.values}>
									<Radio
										className={classes.checkbox}
										label={t('constants.auctionStatus.upcoming.label')}
										value="upcoming"
									/>
									<Radio
										className={classes.checkbox}
										label={t('constants.auctionStatus.ongoing.label')}
										value="ongoing"
									/>
									<Radio
										className={classes.checkbox}
										label={t('constants.auctionStatus.ended.label')}
										value="ended"
									/>
									<Radio
										className={classes.checkbox}
										label={t('marketplace.home.catalogue.filters.all')}
										value="all"
									/>
								</Container>
							</RadioGroup>
						</AccordionPanel>
					</AccordionItem>
					<AccordionItem value={'sector'}>
						<AccordionControl classNames={{ label: classes.title }}>
							{t('marketplace.home.catalogue.filters.accordion.sector.title')}
							<Text className={classes.subtitle}>
								{t('marketplace.home.catalogue.filters.count', {
									value: numFilters.sector,
								})}
							</Text>
						</AccordionControl>
						<AccordionPanel>
							<Text className={classes.description}>
								{t(
									'marketplace.home.catalogue.filters.accordion.sector.description',
								)}
							</Text>
							<Container className={classes.values}>
								<Checkbox
									className={classes.checkbox}
									label={t('constants.sector.energy.title')}
									key={form.key('sector.energy')}
									{...form.getInputProps('sector.energy', { type: 'checkbox' })}
								/>
								<Checkbox
									className={classes.checkbox}
									label={t('constants.sector.industry.title')}
									key={form.key('sector.industry')}
									{...form.getInputProps('sector.industry', { type: 'checkbox' })}
								/>
								<Checkbox
									className={classes.checkbox}
									label={t('constants.sector.transport.title')}
									key={form.key('sector.transport')}
									{...form.getInputProps('sector.transport', {
										type: 'checkbox',
									})}
								/>
								<Checkbox
									className={classes.checkbox}
									label={t('constants.sector.buildings.title')}
									key={form.key('sector.buildings')}
									{...form.getInputProps('sector.buildings', {
										type: 'checkbox',
									})}
								/>
								<Checkbox
									className={classes.checkbox}
									label={t('constants.sector.agriculture.title')}
									key={form.key('sector.agriculture')}
									{...form.getInputProps('sector.agriculture', {
										type: 'checkbox',
									})}
								/>
								<Checkbox
									className={classes.checkbox}
									label={t('constants.sector.waste.title')}
									key={form.key('sector.waste')}
									{...form.getInputProps('sector.waste', { type: 'checkbox' })}
								/>
							</Container>
						</AccordionPanel>
					</AccordionItem>
					<AccordionItem value={'joined'}>
						<AccordionControl classNames={{ label: classes.title }}>
							{t('marketplace.home.catalogue.filters.accordion.joined.title')}
							<Text className={classes.subtitle}>
								{t('marketplace.home.catalogue.filters.count', {
									value: numFilters.joined,
								})}
							</Text>
						</AccordionControl>
						<AccordionPanel>
							<Text className={classes.description}>
								{t.rich(
									'marketplace.home.catalogue.filters.accordion.joined.description',
									{ a: (chunks) => <Anchor href="#">{chunks}</Anchor> },
								)}
							</Text>
							<RadioGroup key={form.key('joined')} {...form.getInputProps('joined')}>
								<Container className={classes.values}>
									<Radio
										className={classes.checkbox}
										label={t(
											'marketplace.home.catalogue.filters.accordion.joined.options.joined',
										)}
										value="joined"
									/>
									<Radio
										className={classes.checkbox}
										label={t(
											'marketplace.home.catalogue.filters.accordion.joined.options.notJoined',
										)}
										value="notJoined"
									/>
									<Radio
										className={classes.checkbox}
										label={t('marketplace.home.catalogue.filters.all')}
										value="all"
									/>
								</Container>
							</RadioGroup>
						</AccordionPanel>
					</AccordionItem>
					<AccordionItem value={'ownership'}>
						<AccordionControl classNames={{ label: classes.title }}>
							{t('marketplace.home.catalogue.filters.accordion.ownership.title')}
							<Text className={classes.subtitle}>
								{t('marketplace.home.catalogue.filters.count', {
									value: numFilters.ownership,
								})}
							</Text>
						</AccordionControl>
						<AccordionPanel>
							<Text className={classes.description}>
								{t.rich(
									'marketplace.home.catalogue.filters.accordion.ownership.description',
									{ a: (chunks) => <Anchor href="#">{chunks}</Anchor> },
								)}
							</Text>
							<RadioGroup
								key={form.key('ownership')}
								{...form.getInputProps('ownership')}
							>
								<Container className={classes.values}>
									<Radio
										className={classes.checkbox}
										label={t(
											'marketplace.home.catalogue.filters.accordion.ownership.options.government',
										)}
										value="government"
									/>
									<Radio
										className={classes.checkbox}
										label={t(
											'marketplace.home.catalogue.filters.accordion.ownership.options.private',
										)}
										value="private"
									/>
									<Radio
										className={classes.checkbox}
										label={t('marketplace.home.catalogue.filters.all')}
										value="all"
									/>
								</Container>
							</RadioGroup>
						</AccordionPanel>
					</AccordionItem>
					<AccordionItem value={'date'}>
						<AccordionControl classNames={{ label: classes.title }}>
							{t('marketplace.home.catalogue.filters.accordion.date.title')}
							<Text className={classes.subtitle}>
								{t('marketplace.home.catalogue.filters.boolean', {
									value: numFilters.date,
								})}
							</Text>
						</AccordionControl>
						<AccordionPanel>
							<Text className={classes.description}>
								{t('marketplace.home.catalogue.filters.accordion.date.description')}
							</Text>
							<Container className={classes.values}>
								<DatePickerInput
									type="range"
									placeholder="Start Date - End Date"
									key={form.key('date')}
									allowSingleDateInRange
									clearable
									{...form.getInputProps('date')}
								/>
							</Container>
						</AccordionPanel>
					</AccordionItem>
					<AccordionItem value={'permits'}>
						<AccordionControl classNames={{ label: classes.title }}>
							{t('marketplace.home.catalogue.filters.accordion.permits.title')}
							<Text className={classes.subtitle}>
								{t('marketplace.home.catalogue.filters.boolean', {
									value: numFilters.permits,
								})}
							</Text>
						</AccordionControl>
						<AccordionPanel>
							<Text className={classes.description}>
								{t(
									'marketplace.home.catalogue.filters.accordion.permits.description',
								)}
							</Text>
							<Container className={classes.values}>
								<RangeSlider
									className={classes.range}
									min={MIN_PERMITS}
									max={MAX_PERMITS}
									thumbSize={14}
									size={'sm'}
									key={form.key('permits')}
									labelAlwaysOn
									{...form.getInputProps('permits')}
								/>
							</Container>
						</AccordionPanel>
					</AccordionItem>
					<AccordionItem value={'minBid'}>
						<AccordionControl classNames={{ label: classes.title }}>
							{t('marketplace.home.catalogue.filters.accordion.minBid.title')}
							<Text className={classes.subtitle}>
								{t('marketplace.home.catalogue.filters.boolean', {
									value: numFilters.minBid,
								})}
							</Text>
						</AccordionControl>
						<AccordionPanel>
							<Text className={classes.description}>
								{t(
									'marketplace.home.catalogue.filters.accordion.minBid.description',
								)}
							</Text>
							<Container className={classes.values}>
								<RangeSlider
									className={classes.range}
									min={MIN_BID}
									max={MAX_BID}
									thumbSize={14}
									size={'sm'}
									key={form.key('minBid')}
									labelAlwaysOn
									{...form.getInputProps('minBid')}
								/>
							</Container>
						</AccordionPanel>
					</AccordionItem>
					<AccordionItem value={'price'}>
						<AccordionControl classNames={{ label: classes.title }}>
							{t('marketplace.home.catalogue.filters.accordion.price.title')}
							<Text className={classes.subtitle}>
								{t('marketplace.home.catalogue.filters.boolean', {
									value: numFilters.price,
								})}
							</Text>
						</AccordionControl>
						<AccordionPanel>
							<Text className={classes.description}>
								{t(
									'marketplace.home.catalogue.filters.accordion.price.description',
								)}
							</Text>
							<Container className={classes.values}>
								<RangeSlider
									className={classes.range}
									min={MIN_PRICE}
									max={MAX_PRICE}
									thumbSize={14}
									size={'sm'}
									key={form.key('price')}
									labelAlwaysOn
									{...form.getInputProps('price')}
								/>
							</Container>
						</AccordionPanel>
					</AccordionItem>
				</Accordion>
				<Group className={classes.footer}>
					<Text className={classes.value}>
						{t('marketplace.home.catalogue.filters.total', {
							value: numFilters.total,
						})}
					</Text>
					<Group className={classes.actions}>
						<Tooltip label={t('marketplace.home.catalogue.filters.clear.tooltip')}>
							<ActionIcon
								className={`${classes.action} ${classes.square}`}
								onClick={handleClearFilters}
							>
								<IconTrash size={16} />
							</ActionIcon>
						</Tooltip>
						<Tooltip label={t('marketplace.home.catalogue.filters.reset.tooltip')}>
							<ActionIcon
								className={`${classes.action} ${classes.square}`}
								onClick={form.reset}
							>
								<IconArrowBackUp size={16} />
							</ActionIcon>
						</Tooltip>
						<Tooltip label={t('marketplace.home.catalogue.filters.apply.tooltip')}>
							<Button
								className={classes.action}
								type="submit"
								rightSection={<IconCheck size={16} />}
							>
								{t('marketplace.home.catalogue.filters.apply.label')}
							</Button>
						</Tooltip>
					</Group>
				</Group>
			</form>
		</Container>
	);
};

export const FiltersList = () => {
	const t = useTranslations();

	return (
		<Stack className={classes.filters} visibleFrom="md">
			<Group className={classes.header}>
				<Container className={classes.bg}>
					<Container className={classes.graphic} />
					<Container className={classes.graphic} />
					<Container className={classes.graphic} />
					<Container className={classes.graphic} />
				</Container>
				<Title className={classes.heading} order={3}>
					{t('marketplace.home.catalogue.filters.heading')}
				</Title>
				<Text className={classes.subheading}>
					{t('marketplace.home.catalogue.filters.subheading')}
				</Text>
			</Group>
			<Divider />
			<FiltersCore />
		</Stack>
	);
};

export const FiltersModal = () => {
	const t = useTranslations();
	const { isFilterModalOpen, closeFiltersModal } = useContext(AuctionCatalogueContext);

	return (
		<Modal
			classNames={{
				root: `${classes.filters} ${classes.modal}`,
				inner: classes.inner,
				content: classes.content,
				body: classes.body,
			}}
			withCloseButton={false}
			opened={isFilterModalOpen}
			onClose={closeFiltersModal}
			centered
		>
			<Stack className={classes.header}>
				<Title order={3} className={classes.heading}>
					{t('marketplace.home.catalogue.filters.heading')}
				</Title>
				<Text className={classes.subheading}>
					{t('marketplace.home.catalogue.filters.subheading')}
				</Text>
				<ActionIcon className={classes.button} onClick={closeFiltersModal}>
					<IconX size={16} />
				</ActionIcon>
			</Stack>
			<FiltersCore />
		</Modal>
	);
};
