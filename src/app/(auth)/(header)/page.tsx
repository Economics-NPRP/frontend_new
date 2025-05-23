import classes from '@/pages/(auth)/styles.module.css';
import { Button, Stack, Text, Title } from '@mantine/core';
import { IconArrowLeft, IconBox } from '@tabler/icons-react';

export interface HeaderProps {
	heading: string;
	subheading: string;
	returnPage?: {
		url: string;
		text: string;
	};
}
export default function Header({ heading, subheading, returnPage }: HeaderProps) {
	return (
		<Stack className={`${classes.header} ${classes.section}`}>
			{returnPage && (
				<Button
					component="a"
					href={returnPage.url}
					variant="subtle"
					leftSection={<IconArrowLeft size={16} />}
					className={classes.return}
				>
					{returnPage.text}
				</Button>
			)}
			<IconBox size={24} />
			<Title className={classes.heading}>{heading}</Title>
			<Text className={classes.subheading}>{subheading}</Text>
		</Stack>
	);
}
