'use client';

import { useTranslations } from 'next-intl';
import { useContextSelector } from 'use-context-selector';

import { SectorFormCard } from '@/components/SectorFormCard';
import { CreateLayoutContext } from '@/pages/create/_components/Providers';
import { ICreateAuctionStepProps } from '@/pages/create/auction/primary/@form/page';
import { Alert, List, Radio, Stack, Text, Title } from '@mantine/core';
import { IconExclamationCircle } from '@tabler/icons-react';

import classes from './styles.module.css';

export const SectorStep = ({ form }: ICreateAuctionStepProps) => {
	const t = useTranslations();
	const formError = useContextSelector(CreateLayoutContext, (context) => context.formError);
	const setFormError = useContextSelector(CreateLayoutContext, (context) => context.setFormError);

	return (
		<Stack className={`${classes.sector} ${classes.root}`}>
			<Stack className={classes.header}>
				<Title order={2} className={classes.heading}>
					{t('create.auction.sector.header.heading')}
				</Title>
				<Text className={classes.subheading}>
					{t('create.auction.sector.header.subheading')}
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
			<Radio.Group
				classNames={{
					root: classes.content,
					error: 'hidden',
				}}
				required
				key={form.key('sector')}
				{...form.getInputProps('sector')}
				onChange={(value) => {
					if (value === form.getValues().sector) return;
					form.getInputProps('subsector').onChange(null);
					form.getInputProps('sector').onChange(value);
				}}
			>
				<SectorFormCard type="radio" sector="energy" />
				<SectorFormCard type="radio" sector="industry" />
				<SectorFormCard type="radio" sector="transport" />
				<SectorFormCard type="radio" sector="buildings" />
				<SectorFormCard type="radio" sector="agriculture" />
				<SectorFormCard type="radio" sector="waste" />
			</Radio.Group>
		</Stack>
	);
};
