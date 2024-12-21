import { Button, Center, Tooltip } from '@mantine/core';
import { IconCommand, IconSearch } from '@tabler/icons-react';

import classes from './styles.module.css';

export const SearchBar = () => {
	return (
		<>
			<Center className={classes.searchBar} visibleFrom="md">
				<Tooltip label="Open the search bar">
					<Button
						className={classes.searchButton}
						variant="transparent"
						fullWidth
						leftSection={<IconSearch size={14} />}
					>
						Search for an auction...
					</Button>
				</Tooltip>
				<Center className={classes.shortcut}>
					<IconCommand size={14} />K
				</Center>
			</Center>
		</>
	);
};
