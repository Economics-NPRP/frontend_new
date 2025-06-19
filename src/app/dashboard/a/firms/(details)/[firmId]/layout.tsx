import { Metadata } from 'next';
import { ReactNode } from 'react';

import { SingleFirmProvider } from '@/contexts';
import { withProviders } from '@/helpers';
import { getSingleFirm } from '@/lib/users/firms';
import { Stack } from '@mantine/core';

import classes from './styles.module.css';

type Props = {
	params: Promise<{ firmId: string }>;
};
export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
	const { firmId } = await params;
	const firm = await getSingleFirm(firmId);
	if (!firm) {
		return {
			title: {
				default: 'Firm Not Found',
				template: '%s - Firm Not Found',
			},
		};
	}
	return {
		title: {
			default: firm.name,
			template: `%s - ${firm.name}`,
		},
	};
};

export interface FirmDetailsProps {
	details: ReactNode;
	environment: ReactNode;
	hero: ReactNode;
	trading: ReactNode;
	users: ReactNode;
}
export default function FirmDetails({
	details,
	environment,
	hero,
	trading,
	users,
}: FirmDetailsProps) {
	return withProviders(
		<Stack className={classes.root}>
			{hero}
			{details}
			{users}
			{trading}
			{environment}
		</Stack>,
		{ provider: SingleFirmProvider },
	);
}
