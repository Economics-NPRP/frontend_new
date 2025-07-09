'use client';

import { useTranslations } from 'next-intl';
import { useContextSelector } from 'use-context-selector';

import { SectorFormCard } from '@/components/SectorFormCard';
import { CreateLayoutContext } from '@/pages/create/_components/Providers';
import { ICreateCycleStepProps } from '@/pages/create/cycle/@form/page';
import { Alert, Checkbox, List, Stack, Text, Title } from '@mantine/core';
import { IconExclamationCircle } from '@tabler/icons-react';

import classes from './styles.module.css';

export const SectorStep = ({ form }: ICreateCycleStepProps) => {
	const t = useTranslations();
	const formError = useContextSelector(CreateLayoutContext, (context) => context.formError);
	const setFormError = useContextSelector(CreateLayoutContext, (context) => context.setFormError);

	return (
		<Stack className={`${classes.sector} ${classes.root}`}>
			<Stack className={classes.header}>
				<Title order={2} className={classes.heading}>
					{t('create.cycle.sector.header.heading')}
				</Title>
				<Text className={classes.subheading}>
					{t('create.cycle.sector.header.subheading')}
				</Text>
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
			<Checkbox.Group
				classNames={{
					root: classes.content,
					error: 'hidden',
				}}
				required
				key={form.key('sectors')}
				{...form.getInputProps('sectors')}
			>
				<SectorFormCard sector="energy" />
				<SectorFormCard sector="industry" />
				<SectorFormCard sector="transport" />
				<SectorFormCard sector="buildings" />
				<SectorFormCard sector="agriculture" />
				<SectorFormCard sector="waste" />
			</Checkbox.Group>
		</Stack>
	);
};
