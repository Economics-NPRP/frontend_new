'use client';

import { useTranslations } from 'next-intl';
import { useContextSelector } from 'use-context-selector';

import { SectorFormCard } from '@/components/SectorFormCard';
import { CreateLayoutContext } from '@/pages/create/_components/Providers';
import { ICreateAuctionStepProps } from '@/pages/create/auction/@form/page';
import { Alert, Checkbox, List, Stack, Text, Title } from '@mantine/core';
import { IconExclamationCircle } from '@tabler/icons-react';

import classes from './styles.module.css';

export const SubsectorStep = ({ form }: ICreateAuctionStepProps) => {
	const t = useTranslations();
	const formError = useContextSelector(CreateLayoutContext, (context) => context.formError);

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
		</Stack>
	);
};
