import { useMemo } from 'react';

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
	title?: string;
	description?: string;
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
				<Anchor key={label} href={href}>
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
							variant="light"
							component="a"
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
			{title && (
				<Title order={1} className={classes.title}>
					{title}
				</Title>
			)}
			{description && <Text className={classes.description}>{description}</Text>}
		</Stack>
	);
};
