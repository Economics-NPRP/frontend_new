'use client';

import { DateTime } from 'luxon';
import { PropsWithChildren, useState } from 'react';

import {
	DefaultSectorDetailsPageContextData,
	SectorDetailsPageContext,
} from '@/pages/dashboard/a/cycles/sectors/[sector]/(details)/_components/Providers';

export const PageProvider = ({ children }: PropsWithChildren) => {
	const [selectedPeriod, setSelectedPeriod] = useState<DateTime>(
		DefaultSectorDetailsPageContextData.selectedPeriod,
	);
	const [selectedSubsector, setSelectedSubsector] = useState<string | null>(
		DefaultSectorDetailsPageContextData.selectedSubsector,
	);

	return (
		<SectorDetailsPageContext.Provider
			value={{
				selectedPeriod,
				setSelectedPeriod,

				selectedSubsector,
				setSelectedSubsector,
			}}
		>
			{children}
		</SectorDetailsPageContext.Provider>
	);
};
