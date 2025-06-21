import { Avatar, AvatarProps, Container, Text, UnstyledButton } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';

import classes from './styles.module.css';

export const AvatarUpload = ({ className }: AvatarProps) => {
	return (
		<Container className={`${classes.root} ${className}`}>
			<Avatar size="xl" className={classes.avatar} />
			<UnstyledButton className={classes.overlay}>
				<IconUpload size={24} className={classes.icon} />
				<Text className={classes.text}>Upload New Photo</Text>
			</UnstyledButton>
		</Container>
	);
};
