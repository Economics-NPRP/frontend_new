import { Stack } from '@mantine/core';

import classes from './styles.module.css';

export default function Trading() {
	return (
		<Stack className={classes.root}>
			Show auctions joined by the firm, their results, and payment status.
		</Stack>
	);
}
