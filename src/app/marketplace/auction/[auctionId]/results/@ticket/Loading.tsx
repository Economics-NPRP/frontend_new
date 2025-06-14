import { Loader, Stack, Text } from '@mantine/core';

import classes from './styles.module.css';

export const Loading = () => {
	return (
		<Stack className={`${classes.loading} ${classes.ticket}`}>
			<Stack className={classes.header}>
				<Loader color="gray" className={classes.loader} />
				<Text className={classes.subtitle}>Loading Results...</Text>
			</Stack>
		</Stack>
	);
};
