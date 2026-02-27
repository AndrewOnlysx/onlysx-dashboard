import * as React from 'react';
import { NextAppProvider } from '@toolpad/core/nextjs';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import { Container, ThemeProvider } from '@mui/material';
import type { Navigation } from '@toolpad/core/AppProvider';
import { SessionProvider, signIn, signOut } from 'next-auth/react';
import { auth } from '../auth';
import { theme } from '@/theme/ThemeColors';
import Image from 'next/image';
import { AnalysisTextLinkIcon } from '@hugeicons-pro/core-stroke-rounded';

import { WebDesign02Icon } from '@hugeicons-pro/core-solid-rounded';
import { HighHeels02Icon, } from '@hugeicons-pro/core-solid-rounded';
import { HugeiconsIcon } from '@hugeicons/react'
import ContainerPage from '@/components/Layout/Layouts';
export const metadata = {
  title: 'ONLYSX',
  description: 'This is a sample app built with Toolpad Core and Next.js',
};

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: '',
    title: 'MUI components',
    icon: <DashboardIcon />,
  },
  {
    segment: 'dataGrid',
    title: 'MUI data grid',
    icon: <PersonIcon />,

  },
  {
    segment: 'charts',
    title: 'Charts',
    icon: <PersonIcon />,
  }, {
    kind: 'page',
    segment: 'pageClients',
    title: 'Page clients',
    icon: <HugeiconsIcon
      icon={WebDesign02Icon}
      size={24}
      color="currentColor"
      strokeWidth={0}
    />,
    children: [
      {
        kind: 'page',
        segment: 'overview',
        title: 'Overview',
        icon: <HugeiconsIcon
          icon={AnalysisTextLinkIcon}
          size={26}
          color="currentColor"
          strokeWidth={1.5}
        />,
      },
      {
        kind: 'page',
        segment: 'models',
        title: 'Models',
        icon: <HugeiconsIcon
          icon={HighHeels02Icon}
          size={24}
          color="currentColor"
          strokeWidth={0}
        />,
      }, {
        kind: 'page',
        segment: 'galeries',
        title: 'Galeries',
        icon: <HugeiconsIcon
          icon={HighHeels02Icon}
          size={24}
          color="currentColor"
          strokeWidth={0}
        />,

      },
      {
        kind: 'page',
        segment: 'videos',
        title: 'Videos',
        icon: <HugeiconsIcon
          icon={HighHeels02Icon}
          size={24}
          color="currentColor"
          strokeWidth={0}
        />,
      }
    ]
  }
];

const BRANDING = {
  title: '',
  logo: <img src='/assets/logo.svg' />,
};


const AUTHENTICATION = {
  signIn,
  signOut,
};


export default async function RootLayout(props: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <html lang="en" data-toolpad-color-scheme="dark" suppressHydrationWarning>
      <body>

        <SessionProvider session={session}>
          <AppRouterCacheProvider options={{ enableCssLayer: true }}>

            <NextAppProvider
              navigation={NAVIGATION}
              branding={BRANDING}
              session={session}
              authentication={AUTHENTICATION}
              theme={theme}

            >

              {props.children}


            </NextAppProvider>

          </AppRouterCacheProvider>
        </SessionProvider>



      </body>
    </html>
  );
}
