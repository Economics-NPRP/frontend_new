'use client';

import { useMantineColorScheme, Button, Group } from '@mantine/core';
import { IconArrowUpRight } from '@tabler/icons-react';

export function ColorSchemesSwitcher() {
	const { setColorScheme, clearColorScheme } = useMantineColorScheme();

	return (
		<Group>
			<Button
				className="shadow-md"
				rightSection={<IconArrowUpRight size={16} />}
				onClick={() => setColorScheme('light')}
			>
				Go to Link
			</Button>
			<Button onClick={() => setColorScheme('dark')}>Dark</Button>
			<Button onClick={() => setColorScheme('auto')}>Auto</Button>
			<Button onClick={clearColorScheme}>Clear</Button>
		</Group>
	);
}
