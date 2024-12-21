import { ColorSchemesSwitcher } from '@/components/color-schemes-switcher';
import { AppShell, AppShellMain, Text, Title } from '@mantine/core';
import { Header } from '@/components/Header';

export default function Home() {
	return (
		<AppShell header={{ height: 60 }} padding="md">
			<Header />
			<AppShellMain>
				<Title className="mt-20 text-center">
					Welcome to{' '}
					<Text
						inherit
						variant="gradient"
						component="span"
						gradient={{ from: 'pink', to: 'yellow' }}
					>
						Mantine
					</Text>{' '}
					+
					<Text
						inherit
						variant="gradient"
						component="span"
						gradient={{ from: 'blue', to: 'green' }}
					>
						TailwindCSS
					</Text>
				</Title>
				<Text
					className="mx-auto mt-xl max-w-[500px] text-center dark:text-gray-300"
					ta="center"
					maw={580}
					mx="auto"
					mt="xl"
				>
					This starter Next.js project includes a minimal setup for
					Mantine with TailwindCSS. To get started edit page.tsx file.
				</Text>

				<div className="mt-10 flex justify-center">
					<ColorSchemesSwitcher />
				</div>
			</AppShellMain>
		</AppShell>
	);
}
