import { ComponentPropsWithRef, useMemo } from 'react';

import { Popover, PopoverDropdown, PopoverTarget, Text } from '@mantine/core';
import { IconHash } from '@tabler/icons-react';

import { IdPrefixes, IdVariantType } from './constants';
import classes from './styles.module.css';

export interface IdProps extends ComponentPropsWithRef<'div'> {
	value: string;
	variant: IdVariantType;
	truncate?: boolean;
}
export const Id = ({ value, variant, truncate, className, ...props }: IdProps) => {
	const prefix = useMemo(() => IdPrefixes[variant], [variant]);
	const text = useMemo(
		() => (truncate ? `${prefix}-${value.split('-')[0]}-...` : `${prefix}-${value}`),
		[prefix, value],
	);

	return (
		<Popover disabled={!truncate}>
			<PopoverTarget>
				<Text
					className={`${classes.root} ${truncate && classes.truncate} ${className}`}
					{...(truncate && { title: 'Click to view the full ID' })}
					{...props}
				>
					<IconHash className={classes.icon} size={12} /> {text}
				</Text>
			</PopoverTarget>
			<PopoverDropdown>
				{prefix}-{value}
			</PopoverDropdown>
		</Popover>
	);
};
