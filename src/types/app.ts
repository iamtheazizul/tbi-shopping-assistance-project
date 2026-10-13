export type Directions = 'list' | 'map';
export type TextSize = 'large' | 'xlarge';
export type ThemeId = 'pea' | 'ocean' | 'sunny' | 'berry';
export type Appearance = 'light' | 'dark' | 'system';
export type Personality = 'calm' | 'cheerful' | 'goofy';
export type PipMood = 'happy' | 'excited' | 'squinting' | 'confused' | 'sleepy' | 'celebrating';
export type NavDirection = 1 | -1 | 0;

export type ScreenName =
'splash' |
'onboarding' |
'home' |
'lists' |
'listDetail' |
'chooseStore' |
'planning' |
'tripPlan' |
'guided' |
'tripComplete' |
'signStore' |
'signCapture' |
'signCamera' |
'signRoll' |
'signScan' |
'signSaved' |
'storeMap' |
'me' |
'about';

export type AreaName = 'Produce' | 'Bakery' | 'Dairy wall';

export type StoreLocation =
{kind: 'aisle';aisle: number;label: string;} |
{kind: 'area';name: AreaName;} |
{kind: 'unknown';};

export interface Fallback {
  aisle: number;
  label: string;
}

export interface CatalogEntry {
  location: StoreLocation;
  helper?: string;
  fallback?: Fallback;
}

export interface TripItem extends CatalogEntry {
  name: string;
}

export type ItemResult = 'pending' | 'found' | 'skipped';

export interface SavedList {
  id: string;
  name: string;
  items: string[];
}

export interface Store {
  id: string;
  name: string;
  place: string;
  updated: string;
}

export interface ThemeOption {
  id: ThemeId;
  name: string;
  primary: string;
  edge: string;
  soft: string;
  softDark: string;
}

export interface MotionCustom {
  direction: NavDirection;
  reduce: boolean;
}