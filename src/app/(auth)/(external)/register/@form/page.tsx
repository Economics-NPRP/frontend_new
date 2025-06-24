'use client';

import { valibotResolver } from 'mantine-form-valibot-resolver';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { ReactElement, useCallback, useContext, useState } from 'react';

import { AccountSummary } from '@/components/AccountSummary';
import { AvatarUpload } from '@/components/AvatarUpload';
import { Switch } from '@/components/SwitchCase';
import { SectorCard } from '@/pages/(auth)/(external)/register/@form/SectorCard';
import { RegistrationPageContext } from '@/pages/(auth)/(external)/register/_components/Providers';
import classes from '@/pages/(auth)/(external)/styles.module.css';
import { CreateFirmDataSchema, DefaultCreateFirm, ICreateFirm } from '@/schema/models';
import {
	Alert,
	Button,
	Container,
	Divider,
	FileInput,
	Group,
	Input,
	List,
	PasswordInput,
	Stack,
	Text,
	TextInput,
	Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
	IconArrowNarrowRight,
	IconBriefcase,
	IconBuilding,
	IconBuildingBank,
	IconCertificate,
	IconCheck,
	IconExclamationCircle,
	IconKey,
	IconMail,
	IconPhone,
	IconWorld,
} from '@tabler/icons-react';

export default function Form() {
	const t = useTranslations();
	const router = useRouter();
	const { activeStep, handleNextStep, handlePrevStep } = useContext(RegistrationPageContext);

	const [formError, setFormError] = useState<Array<ReactElement>>([]);

	const form = useForm<ICreateFirm>({
		mode: 'uncontrolled',
		initialValues: DefaultCreateFirm,
		validate: valibotResolver(CreateFirmDataSchema),
		onValuesChange: () => setFormError([]),
	});

	const handleSubmit = useCallback(
		(formData: ICreateFirm) => {
			form.setSubmitting(true);
			setFormError([]);

			//	Send registration request
			// const registrationToken = searchParams.get('token');
			// register({ registrationToken, password })
			// 	.then((res) => {
			// 		//	TODO: revert once backend returns cookies
			// 		// if (res.ok) router.push('/marketplace');
			// 		if (res.ok) router.push('/login');
			// 		else {
			// 			setFormError(
			// 				(res.errors || []).map((error, index) => (
			// 					<List.Item key={index}>{error}</List.Item>
			// 				)),
			// 			);
			// 		}
			// 		form.setSubmitting(false);
			// 	})
			// 	.catch((err) => {
			// 		console.error('Error registering your account:', err);
			// 		setFormError([
			// 			<List.Item key={0}>{t('auth.onboarding.error.message')}</List.Item>,
			// 		]);
			// 		form.setSubmitting(false);
			// 	});
		},
		[form, router],
	);

	return (
		<>
			{formError.length > 0 && (
				<Alert
					variant="light"
					color="red"
					title={t('auth.onboarding.error.title')}
					icon={<IconExclamationCircle />}
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
						/>
						<PasswordInput
							type="password"
							label={t('auth.onboarding.form.password.label')}
							placeholder={t('auth.onboarding.form.password.placeholder')}
							autoComplete="current-password"
							leftSection={<IconKey size={16} />}
							disabled={form.submitting}
							required
							key={form.key('password')}
							{...form.getInputProps('password')}
						/>
						<PasswordInput
							type="password"
							label={t('auth.onboarding.form.confirm.label')}
							placeholder={t('auth.onboarding.form.confirm.placeholder')}
							autoComplete="current-password"
							leftSection={<IconKey size={16} />}
							disabled={form.submitting}
							required
							key={form.key('confirmPassword')}
							{...form.getInputProps('confirmPassword')}
						/>
						<TextInput
							label={t('auth.register.form.first.crn.label')}
							placeholder={t('auth.register.form.first.crn.placeholder')}
							autoComplete="crn"
							leftSection={<IconCertificate size={16} />}
							required
						/>
						<TextInput
							label={t('auth.register.form.first.iban.label')}
							placeholder={t('auth.register.form.first.iban.placeholder')}
							autoComplete="crn"
							leftSection={<IconBuildingBank size={16} />}
							required
						/>
						<Divider label={t('auth.register.form.first.divider')} />
						<FileInput
							label={t('auth.register.form.first.uploadCrn.label')}
							placeholder={t('auth.register.form.first.uploadCrn.placeholder')}
							required
							clearable
						/>
						<FileInput
							label={t('auth.register.form.first.uploadIban.label')}
							placeholder={t('auth.register.form.first.uploadIban.placeholder')}
							required
							clearable
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
						<Container className={classes.sectors}>
							<SectorCard sector="energy" />
							<SectorCard sector="industry" />
							<SectorCard sector="transport" />
							<SectorCard sector="buildings" />
							<SectorCard sector="agriculture" />
							<SectorCard sector="waste" />
						</Container>
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
						/>
						<TextInput
							label={t('auth.register.form.third.position.label')}
							placeholder={t('auth.register.form.third.position.placeholder')}
							name="position"
							leftSection={<IconBriefcase size={16} />}
						/>
						<TextInput
							type="email"
							label={t('auth.register.form.third.email.label')}
							placeholder={t('auth.register.form.third.email.placeholder')}
							autoComplete="email"
							leftSection={<IconMail size={16} />}
							required
						/>
						<TextInput
							label={t('auth.register.form.third.phone.label')}
							placeholder={t('auth.register.form.third.phone.placeholder')}
							autoComplete="tel"
							leftSection={<IconPhone size={16} />}
							required
						/>
						<TextInput
							label={t('auth.register.form.third.website.label')}
							placeholder={t('auth.register.form.third.website.placeholder')}
							autoComplete="url"
							leftSection={<IconWorld size={16} />}
							required
						/>
						<TextInput
							label={t('auth.register.form.third.address.label')}
							placeholder={t('auth.register.form.third.address.placeholder')}
							autoComplete="address"
							leftSection={<IconBuilding size={16} />}
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
						<AccountSummary
							className={classes.summary}
							firmData={{
								name: 'New Company',
								email: 'test@gmail.com',
								phone: '+974 1234 5678',
								type: 'firm',
								sectors: ['industry', 'transport', 'buildings'],
							}}
						/>
					</Stack>
				</Switch.Case>
			</Switch>

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
							color="green"
							rightSection={<IconCheck size={16} />}
							onClick={handleNextStep}
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
		</>
	);
}
