import React from 'react';
import { useNav } from '../contexts/NavigationContext';
import { focusScreens } from '../data/tabs';
import { ScreenStack } from './ScreenStack';
import { TabBar } from './TabBar';

export function AppShell() {
  const { current } = useNav();
  const showTabs = !focusScreens.includes(current);

  return (
    <div className="flex h-full flex-col">
      <div className="relative flex-1 overflow-hidden">
        <ScreenStack />
      </div>
      {showTabs && <TabBar />}
    </div>);

}