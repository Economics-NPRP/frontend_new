import { Metadata } from 'next';
import { ReactNode } from 'react';

import { SingleFirmProvider } from '@/contexts';
import { withProviders } from '@/helpers';
import { getSingleFirm } from '@/lib/users/firms';
import { Container, Stack } from '@mantine/core';

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
	banner: ReactNode;
	details: ReactNode;
	environment: ReactNode;
	hero: ReactNode;
	trading: ReactNode;
	users: ReactNode;
}
export default function FirmDetails({
	banner,
	details,
	environment,
	hero,
	trading,
	users,
}: FirmDetailsProps) {
	return withProviders(
		<>
			<Container className={classes.bg}>
				<Container className={classes.pattern} />
				<Container className={classes.gradient} />
			</Container>
			<Stack className={classes.root}>
				{hero}
				{banner}
				{details}
				<Container className={classes.content}>
					{users}
					{environment}
					{trading}
				</Container>
			</Stack>
		</>,
		{ provider: SingleFirmProvider },
	);
}
