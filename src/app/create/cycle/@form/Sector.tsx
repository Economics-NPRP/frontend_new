import { useTranslations } from 'next-intl';

import { SectorFormCard } from '@/components/SectorFormCard';
import { Checkbox, Stack, Text, Title } from '@mantine/core';

import classes from './styles.module.css';

export const SectorStep = () => {
	const t = useTranslations();

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
			<Checkbox.Group
				classNames={{
					root: classes.content,
					error: 'hidden',
				}}
				required
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
