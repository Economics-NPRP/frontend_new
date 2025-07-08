import { useTranslations } from 'next-intl';

import { SectorCard } from '@/components/SectorCard';
import { Button, Container, Group, Stack, Text, Title } from '@mantine/core';
import { IconArrowUpRight } from '@tabler/icons-react';

import classes from './styles.module.css';

export default function Categories() {
	const t = useTranslations();

	return (
		<Stack className={classes.root}>
			<Group className={classes.header}>
				<Stack className={classes.label}>
					<Title className={classes.heading}>
						{t('marketplace.home.categories.heading')}
					</Title>
					<Text className={classes.subheading}>
						{t('marketplace.home.categories.subheading')}
					</Text>
				</Stack>
				<Button className={classes.action} rightSection={<IconArrowUpRight size={16} />}>
					{t('constants.view.all.label')}
				</Button>
			</Group>

			<Container className={classes.cards}>
				<SectorCard sector="energy" />
				<SectorCard sector="industry" />
				<SectorCard sector="transport" />
				<SectorCard sector="buildings" />
				<SectorCard sector="agriculture" />
				<SectorCard sector="waste" />
			</Container>
		</Stack>
	);
}
