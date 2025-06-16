import { DateTime, DateTimeUnit } from 'luxon';
import { ComponentProps } from 'react';

export type CountdownUnit = Exclude<DateTimeUnit, 'quarter' | 'week'> | 'empty';
export type CountdownUnitsArray = [CountdownUnit, CountdownUnit, CountdownUnit];

export interface CountdownProps extends ComponentProps<'div'> {
	targetDate: DateTime | string;
	units?: CountdownUnitsArray;
	displayOnly?: boolean;
	loading?: boolean;
}
