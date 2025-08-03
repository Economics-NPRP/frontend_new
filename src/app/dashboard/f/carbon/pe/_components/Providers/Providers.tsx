'use client';

import { DateTime } from 'luxon';
import { PropsWithChildren, useState } from 'react';

import {
	DefaultEmissionsPermitsPageContextData,
	EmissionsPermitsPageContext,
} from '@/pages/dashboard/f/carbon/pe/_components/Providers/constants';

export const PageProvider = ({ children }: PropsWithChildren) => {
	const [selectedPeriod, setSelectedPeriod] = useState<DateTime>(
		DefaultEmissionsPermitsPageContextData.selectedPeriod,
	);

	return (
		<EmissionsPermitsPageContext.Provider
			value={{
				selectedPeriod,
				setSelectedPeriod,
			}}
		>
			{children}
		</EmissionsPermitsPageContext.Provider>
	);
};
