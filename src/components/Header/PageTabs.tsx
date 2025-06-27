'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { FloatingIndicator, Tabs } from '@mantine/core';

import classes from './styles.module.css';

export interface PageTabsProps {
	pageMatcher: (pathname: string) => string | null;
	pages: Array<{
		key: string;
		label: string;
		href: string;
		icon: React.ReactNode;
	}>;
}
export const PageTabs = ({ pageMatcher, pages }: PageTabsProps) => {
	const router = useRouter();
	const pathname = usePathname();

	const [currentTab, setCurrentTab] = useState<string | null>(pageMatcher(pathname) || null);
	const [rootRef, setRootRef] = useState<HTMLDivElement | null>(null);
	const [controlsRefs, setControlsRefs] = useState<Record<string, HTMLButtonElement | null>>({});
	const setControlRef = (val: string) => (node: HTMLButtonElement) => {
		controlsRefs[val] = node;
		setControlsRefs(controlsRefs);
	};

	const handleTabChange = useCallback(
		(value: string | null) => {
			if (!value) return;
			const href = pages.find((page) => page.key === value)?.href;
			if (!href) return;

			setCurrentTab(value);
			router.push(href);
		},
		[pages, router],
	);

	const pagesList = useMemo(
		() =>
			pages.map(({ key, label, icon }) => (
				<Tabs.Tab key={key} ref={setControlRef(key)} value={key} leftSection={icon}>
					{label}
				</Tabs.Tab>
			)),
		[pages, setControlRef],
	);

	//	 Update the current tab when the pathname changes
	useEffect(() => {
		setCurrentTab(pageMatcher(pathname) || null);
	}, [pathname, pageMatcher]);

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
				{pagesList}

				<FloatingIndicator
					className={classes.indicator}
					target={currentTab ? controlsRefs[currentTab] : null}
					parent={rootRef}
				/>
			</Tabs.List>
		</Tabs>
	);
};
