import { Stack, Text, Title } from '@mantine/core';

import classes from './styles.module.css';

export const Unjoined = () => {
	return (
		<Stack className={`${classes.unjoined} ${classes.ticket}`}>
			<Stack className={classes.header}>
				<Title order={2} className={classes.title}>
					You Have Not Joined This Auction
				</Title>
				<Text className={classes.subtitle}>
					Please join the auction to view results and participate in bidding.
				</Text>
			</Stack>
		</Stack>
	);
};
