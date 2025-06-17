import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
	title: 'Firms',
};

export interface FirmsListProps {
	table: ReactNode;
}
export default function FirmsList({ table }: FirmsListProps) {
	return table;
}
