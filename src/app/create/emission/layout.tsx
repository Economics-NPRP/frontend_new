import { Metadata } from 'next';
import { ReactNode } from 'react';

import { withProviders } from '@/helpers';

export const metadata: Metadata = {
	title: 'Report Emissions',
};

export interface CreateEmissionProps {
	form: ReactNode;
}
export default function CreateEmission({ form }: CreateEmissionProps) {
	return withProviders(<>{form}</>);
}
