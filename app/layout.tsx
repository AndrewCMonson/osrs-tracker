import { Footer } from '@/components/layout/footer';
import { Header } from '@/components/layout/header';
import { SessionProvider } from '@/components/session-provider';
import { ThemeProvider } from '@/components/theme-provider';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'OSRS Tracker - Track Your Old School RuneScape Progress',
	description:
		'Track your Old School RuneScape account stats, milestones, and achievements. View skills, boss kill counts, and progress towards your goals.',
	keywords: [
		'OSRS',
		'Old School RuneScape',
		'tracker',
		'hiscores',
		'stats',
		'progress',
	],
	icons: {
		icon: [
			{ url: '/logo.png', type: 'image/png' },
			{ url: '/favicon.ico', sizes: 'any' },
		],
		apple: [
			{ url: '/logo.png', type: 'image/png' },
		],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-stone-950 text-stone-100 dark:bg-stone-950 dark:text-stone-100 light:bg-stone-50 light:text-stone-900`}
			>
				<SessionProvider>
					<ThemeProvider>
						<Header />
						<main className="flex-1">{children}</main>
						<Footer />
					</ThemeProvider>
				</SessionProvider>
			</body>
		</html>
	);
}
