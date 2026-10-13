export type StockReportLevel = 'low' | 'out';

export interface StockReport {
  level: StockReportLevel;
  when: string;
}

// Recent reports from other shoppers, keyed by lowercase item name.
export const recentStockReports: Record<string, StockReport> = {
  chickpeas: { level: 'low', when: 'yesterday' },
  eggs: { level: 'out', when: 'this morning' }
};

export const stockLevels = [
{ value: 'plenty', label: 'Plenty left' },
{ value: 'low', label: 'Running low' },
{ value: 'last', label: 'Last one' }] as
const;

export type StockLevel = (typeof stockLevels)[number]['value'];