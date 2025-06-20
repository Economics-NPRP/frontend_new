import { Stack } from '@mantine/core';

import classes from './styles.module.css';

export default function Environment() {
	return (
		<Stack className={classes.root}>
			Includes details on permits owned by the company, usage, emission reports, etc.
		</Stack>
	);
}
