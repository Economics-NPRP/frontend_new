'use client';

import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useContext } from 'react';

import { MyUserProfileContext } from '@/contexts';
import { throwError, isolateMessage } from '@/helpers';

import {
	login as loginApi,
	logout as logoutApi,
	register as registerApi,
	resendOtp as resendOtpApi,
	verifyOtp as verifyOtpApi,
} from '@/lib/auth';
import { ICreateUserPassword, ILoginData, IOTPData, IReadUser } from '@/schema/models';
import { ServerData } from '@/types';
import { notifications } from '@mantine/notifications';
import { UseMutationResult, useMutation, useQueryClient } from '@tanstack/react-query';

type AuthProps = (options?: {
	onLoginSuccess?: () => void;
	onLoginError?: (error: Error) => void;
	onLoginSettled?: () => void;

	onLogoutSuccess?: () => void;
	onLogoutError?: (error: Error) => void;
	onLogoutSettled?: () => void;

	onRegisterSuccess?: () => void;
	onRegisterError?: (error: Error) => void;
	onRegisterSettled?: () => void;

	onVerifyOtpSuccess?: () => void;
	onVerifyOtpError?: (error: Error) => void;
	onVerifyOtpSettled?: () => void;

	onResendOtpSuccess?: () => void;
	onResendOtpError?: (error: Error) => void;
	onResendOtpSettled?: () => void;
}) => {
	login: UseMutationResult<ServerData<{}>, Error, ILoginData, unknown>;
	logout: UseMutationResult<ServerData<{}>, Error, void, unknown>;
	register: UseMutationResult<ServerData<{}>, Error, ICreateUserPassword, unknown>;
	verifyOtp: UseMutationResult<ServerData<IReadUser>, Error, IOTPData, unknown>;
	resendOtp: UseMutationResult<ServerData<{}>, Error, void, unknown>;
};
export const useAuth: AuthProps = ({
	onLoginSuccess,
	onLoginError,
	onLoginSettled,

	onLogoutSuccess,
	onLogoutError,
	onLogoutSettled,

	onRegisterSuccess,
	onRegisterError,
	onRegisterSettled,

	onVerifyOtpSuccess,
	onVerifyOtpError,
	onVerifyOtpSettled,

	onResendOtpSuccess,
	onResendOtpError,
	onResendOtpSettled,
} = {}) => {
	const t = useTranslations();
	const router = useRouter();
	const queryClient = useQueryClient();
	const searchParams = useSearchParams();
	const myUser = useContext(MyUserProfileContext);

	const login = useMutation({
		mutationFn: (formData: ILoginData) => {
			localStorage.setItem('ets_remember_me', String(formData.remember));
			return throwError(loginApi(formData), `login`);
		},
		onSettled: onLoginSettled,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['users', 'mine'],
			});
			notifications.show({
				color: 'green',
				title: t(
					`lib.auth.login.success.title${process.env.NODE_ENV === 'development' ? 'Dev' : ''}`,
				),
				message: t(
					`lib.auth.login.success.message${process.env.NODE_ENV === 'development' ? 'Dev' : ''}`,
				),
				position: 'bottom-center',
			});
			//	TODO: once backend returns current user, redirect based on user type
			if (process.env.NODE_ENV === 'development') router.back();
			else router.push('/otp');
			onLoginSuccess?.();
		},
		onError: (error: Error) => {
			console.error('Error logging in:', error);
			notifications.show({
				color: 'red',
				title: t('lib.auth.login.error'),
				message: isolateMessage(error.message) ?? t('lib.unknownError'),
				position: 'bottom-center',
			});
			onLoginError?.(error);
		},
		retry: false,
	});

	const logout = useMutation({
		mutationFn: () => throwError(logoutApi(), `logout:${myUser.id}`),
		onSettled: () => {
			router.push('/login');
			onLogoutSettled?.();
		},
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['users', 'mine'],
			});
			notifications.show({
				color: 'green',
				title: t('lib.auth.logout.success.title'),
				message: t('lib.auth.logout.success.message'),
				position: 'bottom-center',
			});
			onLogoutSuccess?.();
		},
		onError: (error: Error) => {
			console.error('Error logging out:', error);
			notifications.show({
				color: 'red',
				title: t('lib.auth.logout.error'),
				message: isolateMessage(error.message) ?? t('lib.unknownError'),
				position: 'bottom-center',
			});
			onLogoutError?.(error);
		},
		retry: false,
	});

	const registrationToken = searchParams.get('token');
	const register = useMutation({
		mutationFn: ({ password }: ICreateUserPassword) =>
			throwError(registerApi({ password, registrationToken }), 'register'),
		onSettled: onRegisterSettled,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ['dashboard', 'admin', 'paginatedFirmApplications'],
			});
			queryClient.invalidateQueries({
				queryKey: ['dashboard', 'admin', 'paginatedFirms'],
			});
			queryClient.invalidateQueries({
				queryKey: ['users', 'firms'],
			});
			notifications.show({
				color: 'green',
				title: t('lib.auth.register.success.title'),
				message: t('lib.auth.register.success.message'),
				position: 'bottom-center',
			});
			router.push('/dashboard/f');
			onRegisterSuccess?.();
		},
		onError: (error: Error) => {
			console.error('Error registering your account:', error);
			notifications.show({
				color: 'red',
				title: t('lib.auth.register.error'),
				message: isolateMessage(error.message),
				position: 'bottom-center',
			});
			onRegisterError?.(error);
		},
		retry: false,
	});

	const verifyOtp = useMutation({
		mutationFn: ({ otp }: IOTPData) => throwError(verifyOtpApi(otp), 'verifyOtp'),
		onSettled: onVerifyOtpSettled,
		onSuccess: (userData: ServerData<IReadUser>) => {
			queryClient.invalidateQueries({
				queryKey: ['users', 'mine'],
			});
			notifications.show({
				color: 'green',
				title: t('lib.auth.otp.success.title'),
				message: t('lib.auth.otp.success.message'),
				position: 'bottom-center',
			});
			router.push(`/dashboard/${userData.type === 'admin' ? 'a' : 'f'}`);
			onVerifyOtpSuccess?.();
		},
		onError: (error: Error) => {
			console.error('Error verifying OTP:', error);
			notifications.show({
				color: 'red',
				title: t('lib.auth.otp.error'),
				message: isolateMessage(error.message),
				position: 'bottom-center',
			});
			onVerifyOtpError?.(error);
		},
		retry: false,
	});

	const resendOtp = useMutation({
		mutationFn: () => throwError(resendOtpApi(), 'resendOtp'),
		onSettled: onResendOtpSettled,
		onSuccess: () => {
			notifications.show({
				color: 'green',
				title: t('lib.auth.resendOtp.success.title'),
				message: t('lib.auth.resendOtp.success.message'),
				position: 'bottom-center',
			});
			onResendOtpSuccess?.();
		},
		onError: (error: Error) => {
			console.error('Error resending OTP:', error);
			notifications.show({
				color: 'red',
				title: t('lib.auth.resendOtp.error'),
				message: isolateMessage(error.message),
				position: 'bottom-center',
			});
			onResendOtpError?.(error);
		},
		retry: false,
	});

	return {
		login,
		logout,
		register,
		verifyOtp,
		resendOtp,
	};
};
