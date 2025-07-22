'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { useContextSelector } from 'use-context-selector';

import { CreateLayoutContext } from '@/pages/create/_components/Providers';
import { ICreateSubsectorStepProps } from '@/pages/create/subsector/@form/page';
import { imageRegex } from '@/schema/models';
import {
	Alert,
	Container,
	List,
	Select,
	Stack,
	TagsInput,
	Text,
	TextInput,
	Textarea,
	Title,
} from '@mantine/core';
import {
	IconAccessible,
	IconAlertHexagon,
	IconChartPie,
	IconExclamationCircle,
	IconLabel,
	IconPhoto,
	IconPhotoHexagon,
} from '@tabler/icons-react';

import classes from './styles.module.css';

export const DetailsStep = ({ form, disabled }: ICreateSubsectorStepProps) => {
	const t = useTranslations();
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const formError = useContextSelector(CreateLayoutContext, (context) => context.formError);
	const setFormError = useContextSelector(CreateLayoutContext, (context) => context.setFormError);

	form.watch('sector', ({ value }) => {
		const newParams = new URLSearchParams(searchParams);
		newParams.set('sector', value);
		router.replace(`${pathname}?${newParams.toString()}`);
	});

	const imageElement = useMemo(() => {
		if (!form.getValues().image)
			return (
				<Container className={classes.placeholder}>
					<IconPhotoHexagon size={32} />
					<Text className={classes.text}>{t('create.subsector.details.image.na')}</Text>
				</Container>
			);

		//	Check if the image url is valid
		try {
			if (!imageRegex.test(form.getValues().image))
				throw new Error('Not a valid URL, should start with http:// or https://');
			const url = new URL(form.getValues().image);
			return (
				<Image
					src={url.href}
					alt={
						form.getValues().alt ||
						`Default alt text for ${searchParams.get('sector')} subsector`
					}
					fill
				/>
			);
		} catch (error) {
			console.error('Error creating image element:', error);
			return (
				<Container className={`${classes.placeholder} ${classes.error}`}>
					<IconAlertHexagon size={32} />
					<Text className={classes.text}>
						{t('create.subsector.details.image.error')}
					</Text>
				</Container>
			);
		}
	}, [form.getValues().image, form.getValues().alt]);

	return (
		<Stack className={`${classes.details} ${classes.root}`}>
			<Stack className={classes.header}>
				<Title order={2} className={classes.heading}>
					{t('create.subsector.details.header.heading')}
				</Title>
				<Text className={classes.subheading}>
					{t('create.subsector.details.header.subheading')}
				</Text>
			</Stack>
			{formError.length > 0 && (
				<Alert
					variant="light"
					color="red"
					title={t('create.subsector.error.title')}
					icon={<IconExclamationCircle />}
					className={classes.alert}
					withCloseButton
					onClose={() => setFormError([])}
				>
					<List>{formError}</List>
				</Alert>
			)}
			<Stack className={classes.inputs}>
				<Container className={classes.image}>{imageElement}</Container>
				<TextInput
					label={t('create.subsector.details.image.label')}
					placeholder={t('create.subsector.details.image.placeholder')}
					leftSection={<IconPhoto size={16} />}
					required
					disabled={disabled}
					key={form.key('image')}
					{...form.getInputProps('image')}
				/>
				<TextInput
					label={t('create.subsector.details.alt.label')}
					placeholder={t('create.subsector.details.alt.placeholder')}
					leftSection={<IconAccessible size={16} />}
					required
					disabled={disabled}
					key={form.key('alt')}
					{...form.getInputProps('alt')}
				/>
				<Select
					label={t('create.subsector.details.sector.label')}
					description={t('create.subsector.details.sector.description')}
					data={[
						{ label: t('constants.sector.energy.title'), value: 'energy' },
						{ label: t('constants.sector.industry.title'), value: 'industry' },
						{ label: t('constants.sector.transport.title'), value: 'transport' },
						{ label: t('constants.sector.buildings.title'), value: 'buildings' },
						{ label: t('constants.sector.agriculture.title'), value: 'agriculture' },
						{ label: t('constants.sector.waste.title'), value: 'waste' },
					]}
					leftSection={<IconChartPie size={16} />}
					allowDeselect={false}
					required
					key={form.key('sector')}
					{...form.getInputProps('sector')}
				/>
				<TextInput
					label={t('create.subsector.details.title.label')}
					placeholder={t('create.subsector.details.title.placeholder')}
					leftSection={<IconLabel size={16} />}
					required
					disabled={disabled}
					key={form.key('title')}
					{...form.getInputProps('title')}
				/>
				<Textarea
					resize="vertical"
					label={t('create.subsector.details.description.label')}
					description={t('create.subsector.details.description.description')}
					placeholder={t('create.subsector.details.description.placeholder')}
					minRows={4}
					autosize
					required
					disabled={disabled}
					key={form.key('description')}
					{...form.getInputProps('description')}
				/>
				<TagsInput
					label={t('create.subsector.details.keywords.label')}
					description={t('create.subsector.details.keywords.description')}
					placeholder={t('create.subsector.details.keywords.placeholder')}
					clearable
					disabled={disabled}
					key={form.key('keywords')}
					{...form.getInputProps('keywords')}
				/>
			</Stack>
		</Stack>
	);
};
