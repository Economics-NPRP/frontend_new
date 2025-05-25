'use client';

import { useLocale, useTranslations } from 'next-intl';

import classes from '@/pages/(auth)/styles.module.css';
import { Stack } from '@mantine/core';

export default function Map() {
	const t = useTranslations();
	const locale = useLocale();

	return <Stack className={`${classes.map} ${classes.section}`}></Stack>;
}
