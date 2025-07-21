import { Metadata } from 'next';
import { ReactNode } from 'react';

import { SingleSubsectorProvider } from '@/contexts';
import { withProviders } from '@/helpers';

export const metadata: Metadata = {
	title: 'Create New Subsector',
};

export interface CreateSubsectorProps {
	form: ReactNode;
}
export default function CreateSubsector({ form }: CreateSubsectorProps) {
	return withProviders(<>{form}</>, {
		provider: SingleSubsectorProvider,
		props: { idSource: 'searchParams' },
	});
}
