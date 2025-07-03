'use client';

import Link from 'next/link';
import { ReactNode, useMemo } from 'react';

import { Switch } from '@/components/SwitchCase';
import {
	Anchor,
	Breadcrumbs,
	Button,
	Divider,
	Group,
	Skeleton,
	Stack,
	Text,
	Title,
	useMatches,
} from '@mantine/core';
import { IconArrowUpLeft, IconChevronRight } from '@tabler/icons-react';

import classes from './styles.module.css';

export interface DashboardHeroProps {
	title?: ReactNode;
	description?: ReactNode;
	meta?: ReactNode;
	badges?: ReactNode;
	actions?: ReactNode;
	returnButton?: {
		href: string;
		label: string;
	};
	breadcrumbs: Array<{
		label: string;
		href: string;
	}>;
	loading?: boolean;
}
export const DashboardHero = ({
	title,
	description,
	meta,
	badges,
	actions,
	returnButton,
	breadcrumbs,
	loading = false,
}: DashboardHeroProps) => {
	const buttonSize = useMatches({
		base: 'xs',
		sm: 'sm',
	});

	const breadcrumbItems = useMemo(
		() =>
			breadcrumbs.map(({ label, href }) => (
				<Anchor component={Link} key={label} href={href}>
					{label}
				</Anchor>
			)),
		[breadcrumbs],
	);

	return (
		<Stack className={classes.root}>
			<Group className={classes.navigation}>
				{returnButton && (
					<>
						<Button
							component={Link}
							href={returnButton.href}
							size={buttonSize}
							leftSection={<IconArrowUpLeft size={16} />}
							className={classes.button}
						>
							{returnButton.label}
						</Button>
						<Divider className={classes.divider} orientation="vertical" />
					</>
				)}
				{breadcrumbItems.length > 1 && (
					<Switch value={loading}>
						<Switch.True>
							<Breadcrumbs
								separator={<IconChevronRight size={14} />}
								classNames={{
									root: classes.breadcrumbs,
									separator: classes.separator,
								}}
							>
								{breadcrumbItems.map((_, index) => (
									<Skeleton key={index} width={80} height={14} visible />
								))}
							</Breadcrumbs>
						</Switch.True>
						<Switch.False>
							<Breadcrumbs
								separator={<IconChevronRight size={14} />}
								classNames={{
									root: classes.breadcrumbs,
									separator: classes.separator,
								}}
							>
								{breadcrumbItems}
							</Breadcrumbs>
						</Switch.False>
					</Switch>
				)}
			</Group>
			<Group className={classes.row}>
				<Stack className={classes.content}>
					<Stack className={classes.label}>
						{meta &&
							(typeof meta === 'string' ? (
								<Text className={classes.meta}>{meta}</Text>
							) : (
								meta
							))}
						{title &&
							(typeof title === 'string' ? (
								<Title order={1} className={classes.title}>
									{title}
								</Title>
							) : (
								title
							))}
						{description &&
							(typeof description === 'string' ? (
								<Text className={classes.description}>{description}</Text>
							) : (
								description
							))}
					</Stack>
					{badges && <Group className={classes.badges}>{badges}</Group>}
				</Stack>
				<Group className={classes.actions}>{actions}</Group>
			</Group>
		</Stack>
	);
};
