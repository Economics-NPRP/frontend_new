'use client';

import { DateTime } from 'luxon';
import { PropsWithChildren, useState } from 'react';

import {
	DefaultSubsectorDetailsPageContextData,
	SubsectorDetailsPageContext,
} from '@/pages/dashboard/a/cycles/sectors/[sector]/[subsector]/_components/Providers';

export const PageProvider = ({ children }: PropsWithChildren) => {
	const [selectedPeriod, setSelectedPeriod] = useState<DateTime>(
		DefaultSubsectorDetailsPageContextData.selectedPeriod,
	);

	return (
		<SubsectorDetailsPageContext.Provider
			value={{
				selectedPeriod,
				setSelectedPeriod,
			}}
		>
			{children}
		</SubsectorDetailsPageContext.Provider>
	);
};
