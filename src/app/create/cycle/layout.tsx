import { Metadata } from 'next';
import { ReactNode } from 'react';

import { SingleCycleProvider } from '@/contexts';
import { withProviders } from '@/helpers';

export const metadata: Metadata = {
	title: 'Create New Cycle',
};

export interface CreateCycleProps {
	form: ReactNode;
}
export default function CreateCycle({ form }: CreateCycleProps) {
	return withProviders(<>{form}</>, {
		provider: SingleCycleProvider,
		props: { idSource: 'searchParams' },
	});
}
