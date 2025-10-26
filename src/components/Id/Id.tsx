import { ComponentPropsWithRef, useMemo } from 'react';

import { Popover, PopoverDropdown, PopoverTarget, Text } from '@mantine/core';
import { IconHash } from '@tabler/icons-react';

import { IdPrefixes, IdVariantType } from './constants';
import classes from './styles.module.css';

export interface IdProps extends ComponentPropsWithRef<'div'> {
	value: string;
	variant: IdVariantType;
	truncate?: boolean;
	includeHash?: boolean;
}
export const Id = ({ value, variant, truncate, className, includeHash=true, ...props }: IdProps) => {
	const prefix = useMemo(() => IdPrefixes[variant], [variant]);
	const text = useMemo(
		() => (truncate ? `${prefix}-${value.split('-')[0]}-...` : `${prefix}-${value}`),
		[prefix, value, truncate],
	);

	return (
		<Popover disabled={!truncate}>
			<PopoverTarget>
				<Text
					className={`${classes.root} ${truncate && classes.short} ${className}`}
					{...(truncate && { title: 'Click to view the full ID' })}
					{...props}
				>
					{includeHash && <IconHash className={classes.icon} size={12} />}{text}
				</Text>
			</PopoverTarget>
			<PopoverDropdown>
				{prefix}-{value}
			</PopoverDropdown>
		</Popover>
	);
};
