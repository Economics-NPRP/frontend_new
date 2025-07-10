import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
	title: 'Create New Cycle',
};

export interface CreateCycleProps {
	form: ReactNode;
}
export default function CreateCycle({ form }: CreateCycleProps) {
	return form;
}
