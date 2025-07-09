'use client';

import { useTranslations } from 'next-intl';
import { useContext, useState } from 'react';
import { useContextSelector } from 'use-context-selector';

import { SubsectorFormCard } from '@/components/SubsectorFormCard';
import { CreateLayoutContext } from '@/pages/create/_components/Providers';
import { ICreateAuctionStepProps } from '@/pages/create/auction/@form/page';
import { SectorChangeModalContext } from '@/pages/create/auction/_components/SectorChangeModal';
import { SectorType, SubsectorType } from '@/schema/models';
import { Alert, Divider, Input, List, Radio, Stack, Text, TextInput, Title } from '@mantine/core';
import { IconExclamationCircle, IconSearch } from '@tabler/icons-react';

import classes from './styles.module.css';

export const SubsectorStep = ({ form }: ICreateAuctionStepProps) => {
	const t = useTranslations();
	const formError = useContextSelector(CreateLayoutContext, (context) => context.formError);
	const { open } = useContext(SectorChangeModalContext);

	const [searchFilter, setSearchFilter] = useState('');

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
				>
					<List>{formError}</List>
				</Alert>
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
					if (sector === form.getValues().sector || !form.getValues().sector) {
						form.getInputProps('sector').onChange(sector);
						form.getInputProps('subsector').onChange(subsector);
					} else {
						open(form.getValues().sector, sector, () => {
							form.setFieldValue('sector', sector);
							form.setFieldValue('subsector', subsector);
						});
					}
				}}
			>
				<SubsectorFormCard type="radio" sector="energy" subsector="gasTurbine" />
				<SubsectorFormCard
					type="radio"
					sector="industry"
					subsector="flareGasRecoveryBurning"
				/>
				<SubsectorFormCard
					type="radio"
					sector="industry"
					subsector="oilAndGasWellheadOperations"
				/>
				<SubsectorFormCard
					type="radio"
					sector="industry"
					subsector="oilAndGasTankStorage"
				/>
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
