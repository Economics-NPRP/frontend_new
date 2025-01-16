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
import { IconArrowBackUp, IconCheck, IconPlus, IconTrash } from '@tabler/icons-react';

import { CatalogueContext, IAuctionFilters } from './constants';
import classes from './styles.module.css';

const MIN_PERMITS = 1;
const MAX_PERMITS = 99999;
const MIN_BID = 1;
const MAX_BID = 999999;
const MIN_PRICE = 1;
const MAX_PRICE = 999999;

const parseFilters = (filters: IAuctionFilters) => ({
	type: {
		open: filters.type?.includes('open') || false,
		sealed: filters.type?.includes('sealed') || false,
	},
	status: {
		ongoing: filters.status?.includes('ongoing') || false,
		ending: filters.status?.includes('ending') || false,
		starting: filters.status?.includes('starting') || false,
		upcoming: filters.status?.includes('upcoming') || false,
		ended: filters.status?.includes('ended') || false,
	},
	sector: {
		energy: filters.sector?.includes('energy') || false,
		industry: filters.sector?.includes('industry') || false,
		transport: filters.sector?.includes('transport') || false,
		buildings: filters.sector?.includes('buildings') || false,
		agriculture: filters.sector?.includes('agriculture') || false,
		waste: filters.sector?.includes('waste') || false,
	},
	//	TODO: Add owner filter
	date: filters.date,
	permits: filters.permits,
	minBid: filters.minBid,
	price: filters.price,
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
		type: parseCheckboxes(values.type),
		status: parseCheckboxes(values.status),
		sector: parseCheckboxes(values.sector),
		//	TODO: Add owner filter
		date: parseDatePicker(values.date),
		permits: parseRange(values.permits, MIN_PERMITS, MAX_PERMITS),
		minBid: parseRange(values.minBid, MIN_BID, MAX_BID),
		price: parseRange(values.price, MIN_PRICE, MAX_PRICE),
	}) as IAuctionFilters;

export const Filters = () => {
	const t = useTranslations();
	const context = useContext(CatalogueContext);

	const form = useForm({
		mode: 'uncontrolled',
		initialValues: parseFilters(context.filters),

		transformValues: parseValues,
	});

	useEffect(() => {
		form.setInitialValues(parseFilters(context.filters));
		form.reset();
	}, [context.filters]);

	const handleClearFilters = useCallback(() => context.setFilters({}), [context.setFilters]);

	const numFilters = useMemo(() => {
		const type = context.filters.type?.length || 0;
		const status = context.filters.status?.length || 0;
		const sector = context.filters.sector?.length || 0;
		const owner = context.filters.owner?.length || 0;
		const date = context.filters.date ? 1 : 0;
		const permits = context.filters.permits ? 1 : 0;
		const minBid = context.filters.minBid ? 1 : 0;
		const price = context.filters.price ? 1 : 0;
		const total = type + status + sector + owner + date + permits + minBid + price;

		return {
			type,
			status,
			sector,
			owner,
			date,
			permits,
			minBid,
			price,
			total,
		};
	}, [context.filters]);

	return (
		<Stack className={classes.filters}>
			<Group className={classes.header}>
				<Container className={classes.bg}>
					<Container className={classes.graphic} />
					<Container className={classes.graphic} />
					<Container className={classes.graphic} />
					<Container className={classes.graphic} />
				</Container>
				<Title className={classes.heading} order={3}>
					Filters List
				</Title>
				<Text className={classes.subheading}>
					Use the filters below to find the auctions you are looking for
				</Text>
			</Group>
			<Divider />
			<form onSubmit={form.onSubmit((value) => context.setFilters(value))}>
				<Accordion
					classNames={{
						root: classes.accordion,
						chevron: classes.chevron,
						content: classes.content,
					}}
					defaultValue={['type', 'sector']}
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
							<Container className={classes.values}>
								<Checkbox
									className={classes.checkbox}
									// TODO: make label translatable
									label="Open"
									key={form.key('type.open')}
									{...form.getInputProps('type.open', { type: 'checkbox' })}
								/>
								<Checkbox
									className={classes.checkbox}
									label="Sealed"
									key={form.key('type.sealed')}
									{...form.getInputProps('type.sealed', { type: 'checkbox' })}
								/>
							</Container>
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
							<Container className={classes.values}>
								<Checkbox
									className={classes.checkbox}
									label="Ongoing"
									key={form.key('status.ongoing')}
									{...form.getInputProps('status.ongoing', { type: 'checkbox' })}
								/>
								<Checkbox
									className={classes.checkbox}
									label="Ending Soon"
									key={form.key('status.ending')}
									{...form.getInputProps('status.ending', { type: 'checkbox' })}
								/>
								<Checkbox
									className={classes.checkbox}
									label="Starting Soon"
									key={form.key('status.starting')}
									{...form.getInputProps('status.starting', { type: 'checkbox' })}
								/>
								<Checkbox
									className={classes.checkbox}
									label="Upcoming"
									key={form.key('status.upcoming')}
									{...form.getInputProps('status.upcoming', { type: 'checkbox' })}
								/>
								<Checkbox
									className={classes.checkbox}
									label="Ended"
									value="ended"
									key={form.key('status.ended')}
									{...form.getInputProps('status.ended', { type: 'checkbox' })}
								/>
							</Container>
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
									label="Energy"
									key={form.key('sector.energy')}
									{...form.getInputProps('sector.energy', { type: 'checkbox' })}
								/>
								<Checkbox
									className={classes.checkbox}
									label="Industry"
									key={form.key('sector.industry')}
									{...form.getInputProps('sector.industry', { type: 'checkbox' })}
								/>
								<Checkbox
									className={classes.checkbox}
									label="Transport"
									key={form.key('sector.transport')}
									{...form.getInputProps('sector.transport', {
										type: 'checkbox',
									})}
								/>
								<Checkbox
									className={classes.checkbox}
									label="Buildings"
									key={form.key('sector.buildings')}
									{...form.getInputProps('sector.buildings', {
										type: 'checkbox',
									})}
								/>
								<Checkbox
									className={classes.checkbox}
									label="Agriculture"
									key={form.key('sector.agriculture')}
									{...form.getInputProps('sector.agriculture', {
										type: 'checkbox',
									})}
								/>
								<Checkbox
									className={classes.checkbox}
									label="Waste"
									key={form.key('sector.waste')}
									{...form.getInputProps('sector.waste', { type: 'checkbox' })}
								/>
							</Container>
						</AccordionPanel>
					</AccordionItem>
					{/* TODO: Add infinite scrolling for owner names/ids */}
					<AccordionItem value={'owner'}>
						<AccordionControl classNames={{ label: classes.title }}>
							{t('marketplace.home.catalogue.filters.accordion.owner.title')}
							<Text className={classes.subtitle}>
								{t('marketplace.home.catalogue.filters.count', {
									value: numFilters.owner,
								})}
							</Text>
						</AccordionControl>
						<AccordionPanel>
							<Text className={classes.description}>
								{t(
									'marketplace.home.catalogue.filters.accordion.owner.description',
								)}
							</Text>
							<TextInput placeholder="Search for a firm by name or ID" />
							<Container className={classes.values}>
								<Checkbox
									className={classes.checkbox}
									label="Fake Company A (FM-a4sh4)"
									value="FM-a4sh4"
								/>
								<Checkbox
									className={classes.checkbox}
									label="Fake Company B (FM-3r4h3)"
									value="FM-3r4h3"
								/>
								<Checkbox
									className={classes.checkbox}
									label="Fake Company C (FM-gsdf7)"
									value="FM-gsdf7"
								/>
								<Checkbox
									className={classes.checkbox}
									label="Fake Company D (FM-823yg)"
									value="FM-823yg"
								/>
								<Checkbox
									className={classes.checkbox}
									label="Fake Company E (FM-13hjk)"
									value="FM-13hjk"
								/>
								<Checkbox
									className={classes.checkbox}
									label="Fake Company F (FM-9sdf8)"
									value="FM-9sdf8"
								/>
								<Checkbox
									className={classes.checkbox}
									label="Fake Company G (FM-1sdf2)"
									value="FM-1sdf2"
								/>
								<Checkbox
									className={classes.checkbox}
									label="Fake Company H (FM-4sdf5)"
									value="FM-4sdf5"
								/>
								<Checkbox
									className={classes.checkbox}
									label="Fake Company I (FM-7sdf8)"
									value="FM-7sdf8"
								/>
								<Checkbox
									className={classes.checkbox}
									label="Fake Company J (FM-2sdf3)"
									value="FM-2sdf3"
								/>
							</Container>
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
						<Tooltip label="Clear all filters">
							<ActionIcon
								className={`${classes.action} ${classes.square}`}
								onClick={handleClearFilters}
							>
								<IconTrash size={16} />
							</ActionIcon>
						</Tooltip>
						<Tooltip label="Reset changes to filters">
							<ActionIcon
								className={`${classes.action} ${classes.square}`}
								onClick={form.reset}
							>
								<IconArrowBackUp size={16} />
							</ActionIcon>
						</Tooltip>
						<Tooltip label="Apply filter changes">
							<Button
								className={classes.action}
								type="submit"
								rightSection={<IconCheck size={16} />}
							>
								Apply
							</Button>
						</Tooltip>
					</Group>
				</Group>
			</form>
		</Stack>
	);
};
