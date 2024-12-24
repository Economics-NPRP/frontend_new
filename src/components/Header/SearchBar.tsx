import { useTranslations } from 'next-intl';

import { Button, Center, Tooltip } from '@mantine/core';
import { IconCommand, IconSearch } from '@tabler/icons-react';

import classes from './styles.module.css';

export const SearchBar = () => {
	const t = useTranslations();

	return (
		<Center className={classes.searchBar} visibleFrom="md">
			<Tooltip label={t('components.header.search.prompt-tooltip')}>
				<Button
					className={classes.searchButton}
					variant="transparent"
					fullWidth
					leftSection={<IconSearch size={14} />}
				>
					{t('components.header.search.prompt')}...
				</Button>
			</Tooltip>
			<Center className={classes.shortcut}>
				<IconCommand size={14} />
				{t('components.header.search.shortcut')}
			</Center>
		</Center>
	);
};
