'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useContext, useEffect } from 'react';

import { AvatarUpload } from '@/components/AvatarUpload';
import { FirmApplicationSummary } from '@/components/FirmApplicationSummary';
import { SectorFormCard } from '@/components/SectorFormCard';
import { Switch } from '@/components/SwitchCase';
import { useCreateApplication } from '@/hooks';
import { RegistrationPageContext } from '@/pages/(auth)/(external)/register/_components/Providers';
import classes from '@/pages/(auth)/(external)/styles.module.css';
import { ICreateFirmApplication } from '@/schema/models';
import {
	Alert,
	Button,
	Checkbox,
	Divider,
	FileInput,
	Group,
	Input,
	List,
	Stack,
	Text,
	TextInput,
	Textarea,
	Title,
} from '@mantine/core';
import {
	IconArrowNarrowRight,
	IconBriefcase,
	IconBuilding,
	IconBuildingBank,
	IconCertificate,
	IconCheck,
	IconExclamationCircle,
	IconMail,
	IconPhone,
	IconRosetteDiscountCheck,
	IconWorld,
} from '@tabler/icons-react';

export default function Form() {
	const t = useTranslations();
	const router = useRouter();
	const { form, formError, setFormError, activeStep, handleNextStep, handlePrevStep } =
		useContext(RegistrationPageContext);

	const createApplication = useCreateApplication({
		onSettled: () => form.setSubmitting(false),
		onSuccess: handleNextStep,
	});

	const handleSubmit = useCallback(
		(formData: ICreateFirmApplication) => {
			form.setSubmitting(true);
			setFormError([]);
			createApplication.mutate(formData);
		},
		[form, router, createApplication],
	);

	//	Scroll to top whenever step changes or there is an error
	useEffect(() => window.scrollTo({ top: 0, behavior: 'smooth' }), [activeStep]);
	useEffect(() => {
		if (formError.length > 0) window.scrollTo({ top: 0, behavior: 'smooth' });
	}, [formError]);

	return (
		<form onSubmit={form.onSubmit(handleSubmit)}>
			{formError.length > 0 && (
				<Alert
					variant="light"
					color="red"
					title={t('auth.onboarding.error.title')}
					icon={<IconExclamationCircle />}
					withCloseButton
					onClose={() => setFormError([])}
				>
					<List>{formError}</List>
				</Alert>
			)}
			<Switch value={activeStep}>
				<Switch.Case when={0}>
					<Stack className={`${classes.header} ${classes.section}`}>
						<Title className={classes.heading}>
							{t('auth.register.heading.first')}
						</Title>
						<Text className={classes.subheading}>
							{t('auth.register.subheading.first')}
						</Text>
					</Stack>
					<Stack className={`${classes.inputs} ${classes.section}`}>
						<Input.Wrapper
							label={t('auth.register.form.first.logo.label')}
							description={t('auth.register.form.first.logo.description')}
							className={classes.avatar}
						>
							<AvatarUpload className={classes.input} />
						</Input.Wrapper>
						<TextInput
							label={t('auth.register.form.first.name.label')}
							placeholder={t('auth.register.form.first.name.placeholder')}
							autoComplete="company"
							leftSection={<IconBuilding size={16} />}
							required
							key={form.key('companyName')}
							{...form.getInputProps('companyName')}
						/>
						<TextInput
							label={t('auth.register.form.first.crn.label')}
							placeholder={t('auth.register.form.first.crn.placeholder')}
							autoComplete="crn"
							leftSection={<IconCertificate size={16} />}
							required
							key={form.key('crn')}
							{...form.getInputProps('crn')}
						/>
						<TextInput
							label={t('auth.register.form.first.iban.label')}
							placeholder={t('auth.register.form.first.iban.placeholder')}
							autoComplete="crn"
							leftSection={<IconBuildingBank size={16} />}
							required
							key={form.key('iban')}
							{...form.getInputProps('iban')}
						/>
						<Divider label={t('auth.register.form.first.divider')} />
						<FileInput
							label={t('auth.register.form.first.uploadCrn.label')}
							placeholder={t('auth.register.form.first.uploadCrn.placeholder')}
							required
							clearable
							key={form.key('crnCertUrl')}
							{...form.getInputProps('crnCertUrl')}
						/>
						<FileInput
							label={t('auth.register.form.first.uploadIban.label')}
							placeholder={t('auth.register.form.first.uploadIban.placeholder')}
							required
							clearable
							key={form.key('ibanCertUrl')}
							{...form.getInputProps('ibanCertUrl')}
						/>
					</Stack>
				</Switch.Case>
				<Switch.Case when={1}>
					<Stack className={`${classes.header} ${classes.section}`}>
						<Title className={classes.heading}>
							{t('auth.register.heading.second')}
						</Title>
						<Text className={classes.subheading}>
							{t('auth.register.subheading.second')}
						</Text>
					</Stack>
					<Stack className={`${classes.inputs} ${classes.section}`}>
						<Checkbox.Group
							classNames={{
								root: classes.sectors,
								error: 'hidden',
							}}
							required
							key={form.key('sectors')}
							{...form.getInputProps('sectors')}
						>
							<SectorFormCard sector="energy" />
							<SectorFormCard sector="industry" />
							<SectorFormCard sector="transport" />
							<SectorFormCard sector="buildings" />
							<SectorFormCard sector="agriculture" />
							<SectorFormCard sector="waste" />
						</Checkbox.Group>
					</Stack>
				</Switch.Case>
				<Switch.Case when={2}>
					<Stack className={`${classes.header} ${classes.section}`}>
						<Title className={classes.heading}>
							{t('auth.register.heading.third')}
						</Title>
						<Text className={classes.subheading}>
							{t('auth.register.subheading.third')}
						</Text>
					</Stack>
					<Stack className={`${classes.inputs} ${classes.section}`}>
						<TextInput
							label={t('auth.register.form.third.fullName.label')}
							placeholder={t('auth.register.form.third.fullName.placeholder')}
							name="fullName"
							autoComplete="name"
							required
							key={form.key('repName')}
							{...form.getInputProps('repName')}
						/>
						<TextInput
							label={t('auth.register.form.third.position.label')}
							placeholder={t('auth.register.form.third.position.placeholder')}
							name="position"
							leftSection={<IconBriefcase size={16} />}
							key={form.key('repPosition')}
							{...form.getInputProps('repPosition')}
						/>
						<TextInput
							type="email"
							label={t('auth.register.form.third.email.label')}
							placeholder={t('auth.register.form.third.email.placeholder')}
							autoComplete="email"
							leftSection={<IconMail size={16} />}
							required
							key={form.key('repEmail')}
							{...form.getInputProps('repEmail')}
						/>
						<TextInput
							label={t('auth.register.form.third.phone.label')}
							placeholder={t('auth.register.form.third.phone.placeholder')}
							autoComplete="tel"
							leftSection={<IconPhone size={16} />}
							required
							key={form.key('repPhone')}
							{...form.getInputProps('repPhone')}
						/>
						<TextInput
							label={t('auth.register.form.third.website.label')}
							placeholder={t('auth.register.form.third.website.placeholder')}
							autoComplete="url"
							leftSection={<IconWorld size={16} />}
							required
							key={form.key('websites')}
							{...form.getInputProps('websites')}
						/>
						<TextInput
							label={t('auth.register.form.third.address.label')}
							placeholder={t('auth.register.form.third.address.placeholder')}
							autoComplete="address"
							leftSection={<IconBuilding size={16} />}
							key={form.key('address')}
							{...form.getInputProps('address')}
						/>
					</Stack>
				</Switch.Case>
				<Switch.Case when={3}>
					<Stack className={`${classes.header} ${classes.section}`}>
						<Title className={classes.heading}>
							{t('auth.register.heading.fourth')}
						</Title>
						<Text className={classes.subheading}>
							{t('auth.register.subheading.fourth')}
						</Text>
					</Stack>
					<Stack className={`${classes.inputs} ${classes.section}`}>
						<FirmApplicationSummary
							className={classes.summary}
							firmData={form.getTransformedValues()}
						/>
						<Textarea
							resize="vertical"
							label={t('auth.register.form.fourth.message.label')}
							description={t('auth.register.form.fourth.message.description')}
							placeholder={t('auth.register.form.fourth.message.placeholder')}
							minRows={4}
							autosize
							key={form.key('message')}
							{...form.getInputProps('message')}
						/>
					</Stack>
				</Switch.Case>
				<Switch.Case when={4}>
					<Stack className={`${classes.message} ${classes.section}`}>
						<IconRosetteDiscountCheck size={64} className={classes.icon} />
						<Title className={classes.heading}>
							{t('auth.register.heading.fifth')}
						</Title>
						<Text className={classes.subheading}>
							{t('auth.register.subheading.fifth')}
						</Text>
						<Button component={Link} href="/login" className={classes.button}>
							{t('constants.return.login.label')}
						</Button>
					</Stack>
				</Switch.Case>
			</Switch>

			{activeStep !== 4 && (
				<Group className={`${classes.action} ${classes.section}`}>
					{activeStep !== 0 && (
						<Button
							variant="outline"
							className={`${classes.secondary} ${classes.button}`}
							onClick={handlePrevStep}
						>
							{t('constants.actions.back.label')}
						</Button>
					)}
					<Switch value={activeStep === 3}>
						<Switch.True>
							<Button
								className={`${classes.success} ${classes.button}`}
								type="submit"
								color="green"
								rightSection={<IconCheck size={16} />}
								loading={form.submitting}
							>
								{t('auth.register.actions.create.label')}
							</Button>
						</Switch.True>
						<Switch.False>
							<Button
								className={`${classes.primary} ${classes.button}`}
								rightSection={<IconArrowNarrowRight size={20} />}
								onClick={handleNextStep}
							>
								{t('constants.actions.continue.label')}
							</Button>
						</Switch.False>
					</Switch>
				</Group>
			)}
		</form>
	);
}
