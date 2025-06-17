import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
	title: 'Home',
};

export interface HomeProps {
	welcome: ReactNode;
}
export default function Home({ welcome }: HomeProps) {
	return welcome;
}
