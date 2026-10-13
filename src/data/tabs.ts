import { CameraIcon, HomeIcon, ListChecksIcon, UserRoundIcon } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ScreenName } from '../types/app';

export interface TabOption {
  label: string;
  root: ScreenName;
  icon: LucideIcon;
}

export const tabs: TabOption[] = [
{ label: 'Home', root: 'home', icon: HomeIcon },
{ label: 'Lists', root: 'lists', icon: ListChecksIcon },
{ label: 'Add sign', root: 'signStore', icon: CameraIcon },
{ label: 'Me', root: 'me', icon: UserRoundIcon }];


// Screens where the tab bar is hidden so nothing competes with the task.
export const focusScreens: ScreenName[] = [
'splash',
'onboarding',
'planning',
'guided',
'tripComplete',
'signCamera',
'signRoll',
'signScan',
'signSaved'];