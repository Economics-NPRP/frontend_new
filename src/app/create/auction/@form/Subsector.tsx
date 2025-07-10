'use client';

import { useTranslations } from 'next-intl';
import { ReactNode, useContext, useMemo, useState } from 'react';
import { useContextSelector } from 'use-context-selector';

import { BaseBadge, SectorBadge } from '@/components/Badge';
import { SubsectorFormCard } from '@/components/SubsectorFormCard';
import { SubsectorData, SubsectorSearch, SubsectorVariants } from '@/constants/SubsectorData';
import { CreateLayoutContext } from '@/pages/create/_components/Providers';
import { ICreateAuctionStepProps } from '@/pages/create/auction/@form/page';
import { SectorChangeModalContext } from '@/pages/create/auction/_components/SectorChangeModal';
import { SectorType, SubsectorType } from '@/schema/models';
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
	const { open } = useContext(SectorChangeModalContext);

	const [searchFilter, setSearchFilter] = useState('');

	const cardElements = useMemo(() => {
		//	Make sure the current selected sector is first
		const keys = Object.keys(SubsectorVariants).sort((a) =>
			a === form.getValues().sector ? -1 : 1,
		) as Array<SectorType>;

		return keys.reduce((acc, sector) => {
			const subsectors = Object.keys(SubsectorVariants[sector]) as Array<SubsectorType>;
			const subsectorData = Object.values(SubsectorVariants[sector]) as Array<SubsectorData>;

			SubsectorSearch.removeAll();
			SubsectorSearch.addAll(subsectorData);
			const searchResults = SubsectorSearch.search(searchFilter);

			if (searchFilter === '')
				acc.push(
					...subsectors.map((subsector) => (
						<SubsectorFormCard
							key={`${sector}:${subsector}`}
							type="radio"
							sector={sector}
							subsector={subsector}
							currentSector={form.getValues().sector}
						/>
					)),
				);
			else
				acc.push(
					...searchResults.map(({ id }) => (
						<SubsectorFormCard
							key={`${sector}:${id}`}
							type="radio"
							sector={sector}
							subsector={id}
							currentSector={form.getValues().sector}
						/>
					)),
				);
			return acc;
		}, [] as Array<ReactNode>);
	}, [searchFilter, form.getValues().sector]);

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
				value={`${form.getValues().sector}:${form.getValues().subsector}`}
				onChange={(value) => {
					const [sector, subsector] = value.split(':') as [SectorType, SubsectorType];
					if (subsector === form.getValues().subsector) return;

					if (sector === form.getValues().sector || !form.getValues().sector) {
						form.getInputProps('sector').onChange(sector);
						form.getInputProps('subsector').onChange(subsector);
					} else {
						open(form.getValues().sector, sector, () => {
							form.getInputProps('sector').onChange(sector);
							form.getInputProps('subsector').onChange(subsector);
						});
					}
				}}
			>
				{cardElements}
			</Radio.Group>
			<Divider
				classNames={{
					root: classes.divider,
					label: classes.label,
				}}
				label={t('create.auction.subsector.divider')}
			/>
			{form.getValues().subsector && (
				<SubsectorFormCard
					type="readonly"
					sector={form.getValues().sector}
					subsector={form.getValues().subsector}
					//	@ts-expect-error - undefined is not assignable to type 'SubsectorType'
					onClear={() => form.setFieldValue('subsector', undefined)}
				/>
			)}
		</Stack>
	);
};
