'use client';

import { useTranslations } from 'next-intl';
import { ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { useContextSelector } from 'use-context-selector';

import { BaseBadge, SectorBadge } from '@/components/Badge';
import { SubsectorFormCard } from '@/components/SubsectorFormCard';
import { SubsectorSearch } from '@/constants/SubsectorData';
import { AllSubsectorsContext } from '@/contexts';
import { CreateLayoutContext } from '@/pages/create/_components/Providers';
import { ICreateAuctionStepProps } from '@/pages/create/auction/@form/page';
import { SectorChangeModalContext } from '@/pages/create/auction/_components/SectorChangeModal';
import { ISubsectorData, SectorType } from '@/schema/models';
import {
	Alert,
	Divider,
	Group,
	Input,
	List,
	Radio,
	Stack,
	Text,
	TextInput,
	Title,
} from '@mantine/core';
import { IconExclamationCircle, IconSearch } from '@tabler/icons-react';

import classes from './styles.module.css';

export const SubsectorStep = ({ form }: ICreateAuctionStepProps) => {
	const t = useTranslations();
	const formError = useContextSelector(CreateLayoutContext, (context) => context.formError);
	const setFormError = useContextSelector(CreateLayoutContext, (context) => context.setFormError);
	const allSubsectors = useContext(AllSubsectorsContext);
	const { open } = useContext(SectorChangeModalContext);

	const [value, setValue] = useState('');
	const [selectedSubsectorData, setSelectedSubsectorData] = useState<ISubsectorData | null>(null);
	const [searchFilter, setSearchFilter] = useState('');

	const cardElements = useMemo(
		() =>
			allSubsectors.data.results
				//	Make sure the current selected sector is first
				.sort((a) => (a.sector === form.getValues().sector ? -1 : 1))
				.reduce((acc, { sector, subsectors }) => {
					SubsectorSearch.removeAll();
					SubsectorSearch.addAll(subsectors);
					const searchResults = SubsectorSearch.search(searchFilter);

					if (searchFilter === '')
						acc.push(
							...subsectors.map((subsector) => (
								<SubsectorFormCard
									key={`${sector}:${subsector.id}`}
									type="radio"
									sector={sector}
									subsector={subsector}
									currentSector={form.getValues().sector}
								/>
							)),
						);
					else
						acc.push(
							...searchResults.map((subsector) => (
								<SubsectorFormCard
									key={`${sector}:${subsector.id}`}
									type="radio"
									sector={sector}
									subsector={subsector as any}
									currentSector={form.getValues().sector}
								/>
							)),
						);
					return acc;
				}, [] as Array<ReactNode>),
		[allSubsectors.data.results, searchFilter, form.getValues().sector],
	);

	const handleSubsectorChange = useCallback(
		(value: string) => {
			const [sectorId, subsectorId] = value.split(':') as [SectorType, string];
			if (subsectorId === form.getValues().subsector) return;

			const subsectorData = allSubsectors.data.results
				.find(({ sector }) => sector === sectorId)
				?.subsectors.find(({ id }) => id === subsectorId);
			if (!subsectorData) return;

			if (sectorId === form.getValues().sector || !form.getValues().sector) {
				form.getInputProps('sector').onChange(sectorId);
				form.getInputProps('subsector').onChange(subsectorId);
				setValue(`${sectorId}:${subsectorId}`);
				setSelectedSubsectorData(subsectorData);
			} else {
				open(form.getValues().sector, sectorId, () => {
					form.getInputProps('sector').onChange(sectorId);
					form.getInputProps('subsector').onChange(subsectorId);
					setValue(`${sectorId}:${subsectorId}`);
					setSelectedSubsectorData(subsectorData);
				});
			}
		},
		[form.getValues().sector, form.getValues().subsector],
	);

	const handleSubsectorClear = useCallback(() => {
		form.getInputProps('subsector').onChange(undefined);
		setValue('');
		setSelectedSubsectorData(null);
	}, []);

	return (
		<Stack className={`${classes.subsector} ${classes.root}`}>
			<Stack className={classes.header}>
				<Title order={2} className={classes.heading}>
					{t('create.auction.subsector.header.heading')}
				</Title>
				<Text className={classes.subheading}>
					{t('create.auction.subsector.header.subheading')}
				</Text>
			</Stack>
			{formError.length > 0 && (
				<Alert
					variant="light"
					color="red"
					title={t('create.auction.error.title')}
					icon={<IconExclamationCircle />}
					className={classes.alert}
					withCloseButton
					onClose={() => setFormError([])}
				>
					<List>{formError}</List>
				</Alert>
			)}
			<Divider
				classNames={{
					root: classes.divider,
					label: classes.label,
				}}
				label={t('create.auction.subsector.divider.selected')}
			/>
			{selectedSubsectorData && (
				<SubsectorFormCard
					type="readonly"
					sector={form.getValues().sector}
					subsector={selectedSubsectorData}
					onClear={handleSubsectorClear}
				/>
			)}
			<Divider
				classNames={{
					root: classes.divider,
					label: classes.label,
				}}
				label={t('create.auction.subsector.divider.list')}
			/>
			<Group className={classes.row}>
				<Text className={classes.label}>{t('create.auction.subsector.sector.label')}</Text>
				{form.getValues().sector ? (
					<SectorBadge sector={form.getValues().sector} className={classes.badge} />
				) : (
					<BaseBadge className={classes.badge}>{t('constants.na')}</BaseBadge>
				)}
				<TextInput
					classNames={{
						root: classes.search,
						wrapper: classes.wrapper,
						input: classes.input,
					}}
					placeholder={t('create.auction.subsector.search.placeholder')}
					value={searchFilter}
					onChange={(event) => setSearchFilter(event.currentTarget.value)}
					leftSection={<IconSearch size={16} />}
					rightSection={
						searchFilter !== '' ? (
							<Input.ClearButton onClick={() => setSearchFilter('')} />
						) : undefined
					}
					rightSectionPointerEvents="auto"
				/>
			</Group>
			<Radio.Group
				classNames={{
					root: classes.content,
					error: 'hidden',
				}}
				required
				key={form.key('subsector')}
				{...form.getInputProps('subsector')}
				value={value}
				onChange={handleSubsectorChange}
			>
				{cardElements}
			</Radio.Group>
		</Stack>
	);
};
