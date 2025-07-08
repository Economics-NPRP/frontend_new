import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
	title: 'Create New Auction',
};

export interface CreateAuctionProps {
	form: ReactNode;
}
export default function CreateAuction({ form }: CreateAuctionProps) {
	return form;
}
