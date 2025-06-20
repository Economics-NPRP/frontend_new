import { Stack } from '@mantine/core';

import classes from './styles.module.css';

export default function Users() {
	return (
		<Stack className={classes.root}>
			List users associated with the firm, their roles/permissions, contact details, and
			button to view their activity.
		</Stack>
	);
}
