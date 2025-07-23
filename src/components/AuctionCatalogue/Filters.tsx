import { PaginatedAuctionsContext } from 'contexts/PaginatedAuctions';
import { useTranslations } from 'next-intl';
import { useCallback, useContext, useEffect, useMemo } from 'react';
import { safeParse } from 'valibot';

import {
	ComponentFiltersData,
	ComponentToQueryFiltersDataTransformer,
	DefaultComponentFiltersData,
	DefaultQueryFiltersData,
	QueryFiltersData,
	QueryToComponentFiltersDataTransformer,
} from '@/schema/models';
import {
	Accordion,
	AccordionControl,
	AccordionItem,
	AccordionPanel,
	ActionIcon,
	Button,
	Checkbox,
	Container,
	Divider,
	Group,
	LoadingOverlay,
	Modal,
	Radio,
	RadioGroup,
	Stack,
	Text,
	Title,
	Tooltip,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconArrowBackUp, IconCheck, IconPlus, IconTrash, IconX } from '@tabler/icons-react';

import { AuctionCatalogueContext, getAuctionFilters } from './constants';
import classes from './styles.module.css';

const FiltersCore = () => {
	const t = useTranslations();
	const paginatedAuctions = useContext(PaginatedAuctionsContext);

	const form = useForm<ComponentFiltersData, (values: ComponentFiltersData) => QueryFiltersData>({
		mode: 'uncontrolled',
		initialValues: DefaultComponentFiltersData,

		transformValues: (values) => {
			const parsedData = safeParse(ComponentToQueryFiltersDataTransformer, values);
			if (!parsedData.success) {
				console.error(
					'There was an error parsing the component filters to query:',
					parsedData.issues,
				);
				return DefaultQueryFiltersData;
			}
			return parsedData.output as QueryFiltersData;
		},
	});

	useEffect(() => {
		const parsedData = safeParse(
			QueryToComponentFiltersDataTransformer,
			paginatedAuctions.filters,
		);

		if (!parsedData.success) {
			console.error(
				'There was an error parsing the query filters to component:',
				parsedData.issues,
			);
			form.setInitialValues(DefaultComponentFiltersData);
			form.reset();
		} else {
			form.setInitialValues(parsedData.output);
			form.reset();
		}
	}, [paginatedAuctions.filters]);

	const handleClearFilters = useCallback(paginatedAuctions.resetFilters, [
		paginatedAuctions.resetFilters,
	]);

	const numFilters = useMemo(() => {
		const output: Partial<Record<keyof QueryFiltersData, number>> = {};
		const total = getAuctionFilters(t).reduce((acc, { id, type }) => {
			let value = 0;
			switch (type) {
				case 'checkbox':
					value = paginatedAuctions.filters[id]?.length || 0;
					break;
				case 'radio':
					value =
						!paginatedAuctions.filters[id] || paginatedAuctions.filters[id] === 'all'
							? 0
							: 1;
					break;
				default:
					value = paginatedAuctions.filters[id] ? 1 : 0;
					break;
			}
			output[id] = value;
			return acc + value;
		}, 0);

		return {
			...(output as Record<keyof QueryFiltersData, number>),
			total,
		};
	}, [t, paginatedAuctions.filters]);

	const accordionSections = useMemo(
		() =>
			getAuctionFilters(t).map(({ id, title, description, type, options }) => {
				let content = <></>;
				switch (type) {
					case 'checkbox':
						content = (
							<Container className={classes.values}>
								{(options || []).map(({ value, label }) => (
									<Checkbox
										className={classes.checkbox}
										value={value}
										label={label}
										key={form.key(`${id}.${value}`)}
										{...form.getInputProps(`${id}.${value}`, {
											type: 'checkbox',
										})}
									/>
								))}
							</Container>
						);
						break;
					case 'radio':
						content = (
							<RadioGroup key={form.key(id)} {...form.getInputProps(id)}>
								<Container className={classes.values}>
									{(options || []).map(({ value, label }) => (
										<Radio key={value} value={value} label={label} />
									))}
								</Container>
							</RadioGroup>
						);
						break;
				}

				return (
					<AccordionItem value={id}>
						<AccordionControl classNames={{ label: classes.title }}>
							{title}
							<Text className={classes.subtitle}>
								{t('components.auctionCatalogue.filters.count', {
									value: numFilters[id],
								})}
							</Text>
						</AccordionControl>
						<AccordionPanel>
							<Text className={classes.description}>{description}</Text>
							{content}
						</AccordionPanel>
					</AccordionItem>
				);
			}),
		[t, numFilters, form],
	);

	return (
		<Container
			className={`${classes.wrapper} ${paginatedAuctions.isFetching ? classes.loading : ''}`}
		>
			<form onSubmit={form.onSubmit((value) => paginatedAuctions.setAllFilters(value))}>
				<LoadingOverlay visible={paginatedAuctions.isFetching} />
				<Group className={classes.footer}>
					<Text className={classes.value}>
						{t('components.auctionCatalogue.filters.total', {
							value: numFilters.total,
						})}
					</Text>
					<Group className={classes.actions}>
						<Tooltip label={t('components.auctionCatalogue.filters.clear.tooltip')}>
							<ActionIcon
								className={`${classes.action} ${classes.square}`}
								onClick={handleClearFilters}
							>
								<IconTrash size={16} />
							</ActionIcon>
						</Tooltip>
						<Tooltip label={t('components.auctionCatalogue.filters.reset.tooltip')}>
							<ActionIcon
								className={`${classes.action} ${classes.square}`}
								onClick={form.reset}
							>
								<IconArrowBackUp size={16} />
							</ActionIcon>
						</Tooltip>
						<Tooltip label={t('components.auctionCatalogue.filters.apply.tooltip')}>
							<Button
								className={classes.action}
								type="submit"
								rightSection={<IconCheck size={16} />}
							>
								{t('components.auctionCatalogue.filters.apply.label')}
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
					{accordionSections}
					{/* <AccordionItem value={'date'}>
						<AccordionControl classNames={{ label: classes.title }}>
							{t('components.auctionCatalogue.filters.accordion.date.title')}
							<Text className={classes.subtitle}>
								{t('components.auctionCatalogue.filters.boolean', {
									value: numFilters.date,
								})}
							</Text>
						</AccordionControl>
						<AccordionPanel>
							<Text className={classes.description}>
								{t('components.auctionCatalogue.filters.accordion.date.description')}
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
							{t('components.auctionCatalogue.filters.accordion.permits.title')}
							<Text className={classes.subtitle}>
								{t('components.auctionCatalogue.filters.boolean', {
									value: numFilters.permits,
								})}
							</Text>
						</AccordionControl>
						<AccordionPanel>
							<Text className={classes.description}>
								{t(
									'components.auctionCatalogue.filters.accordion.permits.description',
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
							{t('components.auctionCatalogue.filters.accordion.minBid.title')}
							<Text className={classes.subtitle}>
								{t('components.auctionCatalogue.filters.boolean', {
									value: numFilters.minBid,
								})}
							</Text>
						</AccordionControl>
						<AccordionPanel>
							<Text className={classes.description}>
								{t(
									'components.auctionCatalogue.filters.accordion.minBid.description',
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
							{t('components.auctionCatalogue.filters.accordion.price.title')}
							<Text className={classes.subtitle}>
								{t('components.auctionCatalogue.filters.boolean', {
									value: numFilters.price,
								})}
							</Text>
						</AccordionControl>
						<AccordionPanel>
							<Text className={classes.description}>
								{t(
									'components.auctionCatalogue.filters.accordion.price.description',
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
					</AccordionItem> */}
				</Accordion>
				<Group className={classes.footer}>
					<Text className={classes.value}>
						{t('components.auctionCatalogue.filters.total', {
							value: numFilters.total,
						})}
					</Text>
					<Group className={classes.actions}>
						<Tooltip label={t('components.auctionCatalogue.filters.clear.tooltip')}>
							<ActionIcon
								className={`${classes.action} ${classes.square}`}
								onClick={handleClearFilters}
							>
								<IconTrash size={16} />
							</ActionIcon>
						</Tooltip>
						<Tooltip label={t('components.auctionCatalogue.filters.reset.tooltip')}>
							<ActionIcon
								className={`${classes.action} ${classes.square}`}
								onClick={form.reset}
							>
								<IconArrowBackUp size={16} />
							</ActionIcon>
						</Tooltip>
						<Tooltip label={t('components.auctionCatalogue.filters.apply.tooltip')}>
							<Button
								className={classes.action}
								type="submit"
								rightSection={<IconCheck size={16} />}
							>
								{t('components.auctionCatalogue.filters.apply.label')}
							</Button>
						</Tooltip>
					</Group>
				</Group>
			</form>
		</Container>
	);
};

export const AuctionCatalogueFiltersList = () => {
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
					{t('components.auctionCatalogue.filters.heading')}
				</Title>
				<Text className={classes.subheading}>
					{t('components.auctionCatalogue.filters.subheading')}
				</Text>
			</Group>
			<Divider />
			<FiltersCore />
		</Stack>
	);
};

export const AuctionCatalogueFiltersModal = () => {
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
					{t('components.auctionCatalogue.filters.heading')}
				</Title>
				<Text className={classes.subheading}>
					{t('components.auctionCatalogue.filters.subheading')}
				</Text>
				<ActionIcon className={classes.button} onClick={closeFiltersModal}>
					<IconX size={16} />
				</ActionIcon>
			</Stack>
			<FiltersCore />
		</Modal>
	);
};
