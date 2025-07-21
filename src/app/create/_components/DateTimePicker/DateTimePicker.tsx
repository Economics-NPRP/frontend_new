import { DateTime } from 'luxon';
import { useTranslations } from 'next-intl';

import { useMatches } from '@mantine/core';
import { DateTimePickerProps, DateTimePicker as MantineDateTimePicker } from '@mantine/dates';

const FORMAT_STRING = 'yyyy-MM-dd HH:mm:ss';

export interface IDateTimePickerProps extends DateTimePickerProps {}
export const DateTimePicker = (props: IDateTimePickerProps) => {
	const t = useTranslations();
	const numCalendarColumns = useMatches({ base: 1, md: 2, lg: 3 });

	return (
		<MantineDateTimePicker
			valueFormat="DD MMM YYYY hh:mm A"
			numberOfColumns={numCalendarColumns}
			timePickerProps={{
				withDropdown: true,
				popoverProps: { withinPortal: false },
				format: '12h',
			}}
			presets={[
				{
					value: DateTime.now().plus({ days: 1 }).toFormat(FORMAT_STRING),
					label: t('create.dateTimePicker.presets.tomorrow'),
				},
				{
					value: DateTime.now()
						.plus({ week: 1 })
						.startOf('week')
						.minus({ days: 1 })
						.toFormat(FORMAT_STRING),
					label: t('create.dateTimePicker.presets.nextWeekStart'),
				},
				{
					value: DateTime.now().plus({ week: 1 }).toFormat(FORMAT_STRING),
					label: t('create.dateTimePicker.presets.nextWeek'),
				},
				{
					value: DateTime.now()
						.plus({ month: 1 })
						.startOf('month')
						.toFormat(FORMAT_STRING),
					label: t('create.dateTimePicker.presets.nextMonthStart'),
				},
				{
					value: DateTime.now().plus({ month: 1 }).toFormat(FORMAT_STRING),
					label: t('create.dateTimePicker.presets.nextMonth'),
				},
				{
					value: DateTime.now()
						.plus({ quarter: 1 })
						.startOf('quarter')
						.toFormat(FORMAT_STRING),
					label: t('create.dateTimePicker.presets.nextQuarterStart'),
				},
				{
					value: DateTime.now().plus({ quarter: 1 }).toFormat(FORMAT_STRING),
					label: t('create.dateTimePicker.presets.nextQuarter'),
				},
			]}
			clearable
			{...props}
		/>
	);
};
