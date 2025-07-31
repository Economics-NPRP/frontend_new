import Link from 'next/link';

import classes from '@/pages/(auth)/(internal)/styles.module.css';
import { HeaderButton } from '@/pages/marketplace/_components/MarketplaceHeader/HeaderButton';
import { Button, Group, Stack, Text, Title } from '@mantine/core';
import { IconArrowLeft, IconBox } from '@tabler/icons-react';

export interface HeaderProps {
	heading: string;
	subheading: string;
	returnPage?: {
		url: string;
		text: string;
	};
}
export const Header = ({ heading, subheading, returnPage }: HeaderProps) => {
	return (
		<Stack className={`${classes.header} ${classes.section}`}>
			<Group className={classes.row}>
				{returnPage && (
					<Button
						component={Link}
						href={returnPage.url}
						variant="subtle"
						leftSection={<IconArrowLeft size={16} />}
						className={classes.return}
					>
						{returnPage.text}
					</Button>
				)}
				<Group className={classes.actions}>
					<HeaderButton variant="language" />
					<HeaderButton variant="theme" />
				</Group>
			</Group>
			<IconBox size={24} />
			<Title className={classes.heading}>{heading}</Title>
			<Text className={classes.subheading}>{subheading}</Text>
		</Stack>
	);
};
