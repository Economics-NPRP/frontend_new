import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';

import { FloatingIndicator, Tabs } from '@mantine/core';

import classes from './styles.module.css';

export interface PageTabsProps {
	defaultTab?: string;
	tabs: Array<{
		label: string;
		href: string;
		icon: React.ReactNode;
	}>;
}
export const PageTabs = ({ defaultTab, tabs }: PageTabsProps) => {
	const router = useRouter();

	const [currentTab, setCurrentTab] = useState<string | null>(defaultTab || tabs[0].href);
	const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
	const [controlsRefs, setControlsRefs] = useState<Record<string, HTMLButtonElement | null>>({});
	const setControlRef = (val: string) => (node: HTMLButtonElement) => {
		controlsRefs[val] = node;
		setControlsRefs(controlsRefs);
	};

	const handleTabChange = useCallback(
		(value: string | null) => {
			if (!value) return;
			setCurrentTab(value);
			router.push(value);
		},
		[router],
	);

	const tabsList = useMemo(
		() =>
			tabs.map(({ label, href, icon }) => (
				<Tabs.Tab key={href} ref={setControlRef(href)} value={href} leftSection={icon}>
					{label}
				</Tabs.Tab>
			)),
		[tabs],
	);

	return (
		<Tabs
			value={currentTab}
			onChange={handleTabChange}
			variant="none"
			classNames={{
				root: classes.tabs,
				list: classes.list,
				tab: classes.tab,
			}}
			visibleFrom="md"
		>
			<Tabs.List ref={setRootRef}>
				{tabsList}

				<FloatingIndicator
					className={classes.indicator}
					target={currentTab ? controlsRefs[currentTab] : null}
					parent={rootRef}
				/>
			</Tabs.List>
		</Tabs>
	);
};
