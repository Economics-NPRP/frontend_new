'use client';

import { PropsWithChildren, useContext, useState } from 'react';

import {
	DashboardAsideContext,
	DefaultDashboardAsideContextData,
	IDashboardAsideContext,
} from '@/pages/dashboard/_components/DashboardAside/constants';
import { Stack, StackProps, Tabs } from '@mantine/core';

import classes from './styles.module.css';

export const DashboardAside = ({ className, ...props }: StackProps) => {
	const { tabs } = useContext(DashboardAsideContext);

	return tabs.length > 0 ? (
		<Stack className={`${classes.root} ${className}`} {...props}>
			<Tabs
				classNames={{ root: classes.tabs, panel: classes.panel }}
				defaultValue={tabs[0].value}
			>
				<Tabs.List grow>
					{tabs.map(({ value, label, icon }) => (
						<Tabs.Tab key={value} value={value} leftSection={icon}>
							{label}
						</Tabs.Tab>
					))}
				</Tabs.List>

				{tabs.map(({ value, content }) => (
					<Tabs.Panel key={value} value={value}>
						{content}
					</Tabs.Panel>
				))}
			</Tabs>
		</Stack>
	) : null;
};

export const DashboardAsideProvider = ({ children }: PropsWithChildren) => {
	const [tabs, setTabs] = useState<IDashboardAsideContext['tabs']>(
		DefaultDashboardAsideContextData.tabs,
	);

	return (
		<DashboardAsideContext.Provider value={{ tabs, setTabs }}>
			{children}
		</DashboardAsideContext.Provider>
	);
};
