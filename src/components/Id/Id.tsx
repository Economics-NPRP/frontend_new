import { ComponentPropsWithRef, useMemo } from 'react';

import { Text } from '@mantine/core';
import { IconHash } from '@tabler/icons-react';

import { IdPrefixes, IdVariantType } from './constants';
import classes from './styles.module.css';

export interface IdProps extends ComponentPropsWithRef<'div'> {
	value: number;
	variant: IdVariantType;
}
export const Id = ({ value, variant, className, ...props }: IdProps) => {
	const prefix = useMemo(() => IdPrefixes[variant], [variant]);

	return (
		<Text className={`${classes.root} ${className}`} {...props}>
			<IconHash size={14} /> {prefix}-{value}
		</Text>
	);
};
