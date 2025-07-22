'use client';

import { AllSubsectorsBySectorContext } from 'contexts/AllSubsectorsBySector';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';

import { SmallSubsectorCard } from '@/components/SubsectorCard';
import { Switch } from '@/components/SwitchCase';
import { DefaultSubsectorData, SectorType } from '@/schema/models';
import {
	Button,
	Container,
	Group,
	Stack,
	Text,
	Title,
	UnstyledButton,
	useMatches,
} from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';

import classes from './styles.module.css';

export default function List() {
	const t = useTranslations();
	const { sector } = useParams();
	const allSubsectors = useContext(AllSubsectorsBySectorContext);
	const dropdownThreshold = useMatches({ base: 2, md: 3, lg: 4, xl: 5 });

	const [allowDropdown, setAllowDropdown] = useState(false);
	const [expanded, setExpanded] = useState(false);

	useEffect(() => {
		if (allSubsectors.data.resultCount > dropdownThreshold) setAllowDropdown(true);
		else {
			setAllowDropdown(false);
			setExpanded(false);
		}
	}, [dropdownThreshold, allSubsectors.data.resultCount]);

	return (
		<Stack className={classes.root}>
			<Group className={classes.header}>
				<Stack className={classes.label}>
					<Title className={classes.heading}>
						{t('dashboard.admin.cycles.sectors.details.list.heading')}
					</Title>
					<Text className={classes.subheading}>
						{t('dashboard.admin.cycles.sectors.details.list.subheading')}
					</Text>
				</Stack>
				{allowDropdown && (
					<Button
						className={classes.action}
						variant="outline"
						onClick={() => setExpanded((prev) => !prev)}
					>
						{expanded
							? t('constants.actions.collapse.label')
							: t('constants.actions.expand.label')}
					</Button>
				)}
			</Group>

			<Group className={classes.row}>
				<Group className={`${classes.list} ${expanded ? classes.expanded : ''}`}>
					<Switch value={allSubsectors.isLoading}>
						<Switch.True>
							{new Array(dropdownThreshold).fill(0).map((_, index) => (
								<SmallSubsectorCard
									key={index}
									className={classes.card}
									subsector={{
										...DefaultSubsectorData,
										sector: sector as SectorType,
									}}
									loading
								/>
							))}
						</Switch.True>
						<Switch.False>
							{allSubsectors.data.results.map((subsector) => (
								<SmallSubsectorCard
									className={classes.card}
									key={subsector.id}
									subsector={subsector}
									component={Link}
									href={`/dashboard/a/cycles/sectors/${subsector.sector}/${subsector.id}`}
								/>
							))}
						</Switch.False>
					</Switch>
				</Group>
				<UnstyledButton
					className={classes.add}
					component={Link}
					href={`/create/subsector?sector=${sector}`}
				>
					<Container className={classes.icon}>
						<IconPlus size={24} />
					</Container>
					<Text className={classes.text}>
						{t('dashboard.admin.cycles.sectors.details.actions.create.heading')}
					</Text>
				</UnstyledButton>
			</Group>
		</Stack>
	);
}
