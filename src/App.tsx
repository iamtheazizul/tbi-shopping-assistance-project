import React from 'react';
import { NavigationProvider } from './contexts/NavigationContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { ToastProvider } from './contexts/ToastContext';
import { TripProvider } from './contexts/TripContext';
import { SignProvider } from './contexts/SignContext';
import { PhoneFrame } from './components/PhoneFrame';
import { AppShell } from './components/AppShell';
import { savedLists } from './data/lists';

interface AppProps {
  firstLaunch?: boolean;
  hasSavedLists?: boolean;
}

export function App({ firstLaunch = true, hasSavedLists = true }: AppProps) {
  return (
    <SettingsProvider onboarded={!firstLaunch}>
      <ToastProvider>
        <TripProvider initialLists={hasSavedLists ? savedLists : []}>
          <SignProvider>
            <NavigationProvider>
              <PhoneFrame>
                <AppShell />
              </PhoneFrame>
            </NavigationProvider>
          </SignProvider>
        </TripProvider>
      </ToastProvider>
    </SettingsProvider>);

}