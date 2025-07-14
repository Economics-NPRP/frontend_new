import { DateTime, Interval } from 'luxon';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';

import { IAuctionCycleData } from '@/schema/models';
import { useMatches } from '@mantine/core';

export const useCycleStatus = (cycle: IAuctionCycleData) => {
	const t = useTranslations();
	const intervalFormat = useMatches({ base: DateTime.DATE_SHORT, md: DateTime.DATE_FULL });

	//	TODO: refresh when cycle ends
	const isUpcoming = useMemo(
		() => new Date(cycle.startDatetime).getTime() > Date.now(),
		[cycle.startDatetime],
	);

	//	TODO: refresh when cycle ends
	const hasEnded = useMemo(
		() => new Date(cycle.endDatetime).getTime() < Date.now(),
		[cycle.endDatetime],
	);

	//	TODO: refresh when cycle ends
	const isLive = useMemo(() => !isUpcoming && !hasEnded, [isUpcoming, hasEnded]);

	const duration = useMemo(() => {
		const start = DateTime.fromISO(cycle.startDatetime);
		const end = DateTime.fromISO(cycle.endDatetime);
		const durationObject = end.diff(start).rescale().toObject();
		if (Object.keys(durationObject).length === 0) return t('constants.na');

		//	Take the largest non-zero unit for display and round it up if there are multiple units
		const unitValuePairs = Object.entries(durationObject);
		const largestUnit = unitValuePairs[0][0] as keyof typeof durationObject;
		let duration = durationObject[largestUnit] || 0;
		if (unitValuePairs.length > 1) duration += 1;
		return `${unitValuePairs.length > 1 ? '~' : ''}${duration} ${t(`components.countdown.label.long.${largestUnit}`)}`;
	}, [cycle.startDatetime, cycle.endDatetime]);

	const interval = useMemo(() => {
		const start = DateTime.fromISO(cycle.startDatetime);
		const end = DateTime.fromISO(cycle.endDatetime);
		return Interval.fromDateTimes(start, end).toLocaleString(intervalFormat);
	}, [cycle.startDatetime, cycle.endDatetime, intervalFormat]);

	return {
		isUpcoming,
		hasEnded,
		isLive,
		duration,
		interval,
	};
};
