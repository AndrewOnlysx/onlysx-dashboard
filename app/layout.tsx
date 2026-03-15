import * as React from 'react';
import { NextAppProvider } from '@toolpad/core/nextjs';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PersonIcon from '@mui/icons-material/Person';
import type { Navigation } from '@toolpad/core/AppProvider';
import { SessionProvider, signIn, signOut } from 'next-auth/react';
import { auth } from '../auth';
import { theme } from '@/theme/ThemeColors';
import { AnalysisTextLinkIcon } from '@hugeicons-pro/core-stroke-rounded';

import { WebDesign02Icon } from '@hugeicons-pro/core-solid-rounded';
import { HighHeels02Icon, } from '@hugeicons-pro/core-solid-rounded';
import { HugeiconsIcon } from '@hugeicons/react'
import { Album01Icon } from '@hugeicons-pro/core-stroke-rounded';
export const metadata = {
  title: 'ONLYSX',
  description: 'Corporate media operations dashboard for ONLYSX',
};

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Control center',
  },
  {
    segment: '',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'dataGrid',
    title: 'Data Grid',
    icon: <PersonIcon />,

  },
  {
    segment: 'charts',
    title: 'Analytics',
    icon: <PersonIcon />,
  }, {
    kind: 'page',
    segment: 'pageClients',
    title: 'Catalogo',
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
          icon={Album01Icon}
          size={24}
          color="currentColor"
          strokeWidth={2}
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
  title: 'ONLYSX Dashboard',
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
