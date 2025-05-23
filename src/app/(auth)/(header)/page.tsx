import { Button, Stack, Text, Title } from '@mantine/core';
import { IconArrowLeft, IconBox } from '@tabler/icons-react';

import classes from '../styles.module.css';

export interface HeaderProps {
	heading?: string;
	subheading?: string;
	returnUrl?: string;
	returnText?: string;
}
export default function Header({ heading, subheading, returnUrl, returnText }: HeaderProps) {
	return (
		<Stack className={`${classes.header} ${classes.section}`}>
			{returnUrl && (
				<Button
					component="a"
					href={returnUrl}
					variant="subtle"
					leftSection={<IconArrowLeft size={16} />}
					className={classes.return}
				>
					{returnText}
				</Button>
			)}
			<IconBox size={24} />
			<Title className={classes.heading}>{heading}</Title>
			<Text className={classes.subheading}>{subheading}</Text>
		</Stack>
	);
}
