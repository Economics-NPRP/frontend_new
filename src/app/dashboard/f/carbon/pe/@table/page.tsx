'use client';

import { PaginatedPermitsContext } from 'contexts/PaginatedPermits';
import { useTranslations } from 'next-intl';
import { useContext, useState } from 'react';

import { PermitsTable } from '@/components/Tables/Permits';
import { FloatingIndicator, Stack, Tabs } from '@mantine/core';
import { IconHistory, IconLeaf, IconLicense } from '@tabler/icons-react';

import classes from './styles.module.css';

export default function Table() {
	const t = useTranslations();
	const permits = useContext(PaginatedPermitsContext);

	const [type, setType] = useState<'permits' | 'emissions' | 'history'>('permits');

	const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
	const [controlsRefs, setControlsRefs] = useState<Record<string, HTMLButtonElement | null>>({});
	const setControlRef = (val: string) => (node: HTMLButtonElement) => {
		controlsRefs[val] = node;
		setControlsRefs(controlsRefs);
	};

	return (
		<Stack className={classes.root}>
			<Tabs
				classNames={{
					root: classes.tabs,
					list: classes.list,
					tab: classes.tab,
					tabLabel: classes.label,
				}}
				variant="none"
				value={type}
				onChange={(value) => setType(value as 'permits' | 'emissions' | 'history')}
			>
				<Tabs.List ref={setRootRef} grow>
					<Tabs.Tab ref={setControlRef('permits')} value="permits">
						<IconLicense size={16} />
						{t('constants.permits.key')}
					</Tabs.Tab>
					<Tabs.Tab ref={setControlRef('emissions')} value="emissions">
						<IconLeaf size={16} />
						{t('constants.emissions.key')}
					</Tabs.Tab>
					<Tabs.Tab ref={setControlRef('history')} value="history">
						<IconHistory size={16} />
						{t('dashboard.firm.carbon.pe.table.tabs.history.label')}
					</Tabs.Tab>

					<FloatingIndicator
						className={classes.indicator}
						target={type ? controlsRefs[type] : null}
						parent={rootRef}
					/>
				</Tabs.List>

				<Tabs.Panel value="permits">
					<PermitsTable permits={permits} />
				</Tabs.Panel>

				<Tabs.Panel value="emissions">emissions</Tabs.Panel>

				<Tabs.Panel value="history">history</Tabs.Panel>
			</Tabs>
		</Stack>
	);
}
