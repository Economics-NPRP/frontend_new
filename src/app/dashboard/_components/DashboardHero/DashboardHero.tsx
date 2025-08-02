'use client';

import Link from 'next/link';
import { ReactNode, useMemo } from 'react';

import { Switch } from '@/components/SwitchCase';
import {
	ActionIcon,
	Anchor,
	Breadcrumbs,
	Container,
	Divider,
	Group,
	Skeleton,
	Stack,
	StackProps,
	Text,
	Title,
	useMatches,
} from '@mantine/core';
import { IconArrowUpLeft, IconChevronRight } from '@tabler/icons-react';

import classes from './styles.module.css';

export interface DashboardHeroProps extends Omit<StackProps, 'title'> {
	icon?: ReactNode;
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
		href?: string;
	}>;
	loading?: boolean;
}
export const DashboardHero = ({
	icon,
	title,
	description,
	meta,
	badges,
	actions,
	returnButton,
	breadcrumbs,
	loading = false,
	className,
	...props
}: DashboardHeroProps) => {
	const buttonSize = useMatches({
		base: 'xs',
		sm: 'sm',
	});

	const breadcrumbItems = useMemo(
		() =>
			breadcrumbs.map(({ label, href }) =>
				href ? (
					<Anchor component={Link} key={label} href={href}>
						{label}
					</Anchor>
				) : (
					<Text key={label}>{label}</Text>
				),
			),
		[breadcrumbs],
	);

	return (
		<Stack className={`${classes.root} ${className}`} {...props}>
			<Group className={classes.navigation}>
				{returnButton && (
					<>
						<ActionIcon
							variant="outline"
							className={classes.button}
							component={Link}
							href={returnButton.href}
							size={buttonSize}
						>
							<IconArrowUpLeft size={16} />
						</ActionIcon>
						<Divider className={classes.divider} orientation="vertical" />
					</>
				)}
				{breadcrumbs.length > 1 && (
					<Switch value={loading}>
						<Switch.True>
							<Breadcrumbs
								separator={<IconChevronRight size={14} />}
								classNames={{
									root: classes.breadcrumbs,
									separator: classes.separator,
								}}
							>
								{breadcrumbs.map((_, index) => (
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
			{(meta || title || description || badges || actions) && (
				<Group className={classes.row}>
					<Switch value={loading}>
						<Switch.True>
							<Stack className={classes.label}>
								<Skeleton width={260} height={14} visible className="my-0.5" />
								<Skeleton width={360} height={40} visible className="my-0.5" />
								<Skeleton width={320} height={16} visible className="my-0.5" />
								{badges && <Group className={classes.badges}>{badges}</Group>}
							</Stack>
						</Switch.True>
						<Switch.False>
							{(icon || meta || title || description || badges) && (
								<Group className={classes.content}>
									{icon && <Container className={classes.icon}>{icon}</Container>}
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
												<Text className={classes.description}>
													{description}
												</Text>
											) : (
												description
											))}
										{badges && (
											<Group className={classes.badges}>{badges}</Group>
										)}
									</Stack>
								</Group>
							)}
						</Switch.False>
					</Switch>
					<Group className={classes.actions}>{actions}</Group>
				</Group>
			)}
		</Stack>
	);
};
