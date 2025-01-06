import { ComponentPropsWithRef, useMemo } from 'react';

import { Popover, PopoverDropdown, PopoverTarget, Text } from '@mantine/core';
import { IconHash } from '@tabler/icons-react';

import { IdPrefixes, IdVariantType } from './constants';
import classes from './styles.module.css';

export interface IdProps extends ComponentPropsWithRef<'div'> {
	value: string;
	variant: IdVariantType;
}
export const Id = ({ value, variant, className, ...props }: IdProps) => {
	const prefix = useMemo(() => IdPrefixes[variant], [variant]);

	return (
		<Popover>
			<PopoverTarget>
				<Text
					className={`${classes.root} ${className}`}
					title="Click to view the full ID"
					{...props}
				>
					<IconHash className={classes.icon} size={14} /> {prefix}-{value.split('-')[0]}
					-...
				</Text>
			</PopoverTarget>
			<PopoverDropdown>
				{prefix}-{value}
			</PopoverDropdown>
		</Popover>
	);
};
