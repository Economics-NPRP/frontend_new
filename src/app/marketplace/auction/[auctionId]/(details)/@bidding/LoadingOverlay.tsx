import { Container, Loader, Stack, Text } from '@mantine/core';

import classes from './styles.module.css';

export const LoadingOverlay = () => {
	return (
		<Stack className={classes.overlay}>
			<Container className={classes.background} />
			<Stack className={`${classes.square} ${classes.content}`}>
				<Loader className={classes.loader} />
				<Text className={classes.description}>Loading Auction...</Text>
			</Stack>
		</Stack>
	);
};
