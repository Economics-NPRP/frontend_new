import { useTranslations } from 'next-intl';

import { CategoryCard } from '@/components/CategoryCard';
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
					{t('constants.viewAll')}
				</Button>
			</Group>

			<Container className={classes.cards}>
				<CategoryCard category="energy" />
				<CategoryCard category="industry" />
				<CategoryCard category="transport" />
				<CategoryCard category="buildings" />
				<CategoryCard category="agriculture" />
				<CategoryCard category="waste" />
			</Container>
		</Stack>
	);
}
