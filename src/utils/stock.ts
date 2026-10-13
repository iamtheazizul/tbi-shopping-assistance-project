import { recentStockReports } from '../data/stockReports';

export function stockNote(itemName: string): string | null {
  const report = recentStockReports[itemName.trim().toLowerCase()];
  if (!report) return null;
  return report.level === 'low' ?
  `Someone said this was running low ${report.when}.` :
  `Someone said the spot was empty ${report.when}.`;
}