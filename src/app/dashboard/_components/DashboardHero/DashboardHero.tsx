import { useMemo } from 'react';

import { Anchor, Breadcrumbs, Button, Divider, Group, Stack, Text, Title } from '@mantine/core';
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
}
export const DashboardHero = ({
	title,
	description,
	returnButton,
	breadcrumbs,
}: DashboardHeroProps) => {
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
							leftSection={<IconArrowUpLeft size={16} />}
							className={classes.button}
						>
							{returnButton.label}
						</Button>
						<Divider className={classes.divider} orientation="vertical" />
					</>
				)}
				{breadcrumbItems.length > 1 && (
					<Breadcrumbs
						separator={<IconChevronRight size={14} />}
						classNames={{
							root: classes.breadcrumbs,
							separator: classes.separator,
						}}
					>
						{breadcrumbItems}
					</Breadcrumbs>
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
