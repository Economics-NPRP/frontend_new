'use client';

import { PropsWithChildren, useCallback, useState } from 'react';

import {
	CycleDetailsPageContext,
	DefaultCycleDetailsPageContextData,
} from '@/pages/dashboard/a/cycles/(details)/[cycleId]/_components/Providers';
import { useDisclosure } from '@mantine/hooks';

export const PageProvider = ({ children }: PropsWithChildren) => {
	const [tab, setTab] = useState<'members' | 'updates'>(DefaultCycleDetailsPageContextData.tab);
	const [opened, { open, close }] = useDisclosure(
		DefaultCycleDetailsPageContextData.isDrawerOpen,
	);

	const handleOpenDrawer = useCallback(
		(tab?: 'members' | 'updates') => {
			open();
			if (tab) setTab(tab);
		},
		[open, setTab],
	);

	return (
		<CycleDetailsPageContext.Provider
			value={{
				tab,
				setTab,

				isDrawerOpen: opened,
				openDrawer: handleOpenDrawer,
				closeDrawer: close,
			}}
		>
			{children}
		</CycleDetailsPageContext.Provider>
	);
};
