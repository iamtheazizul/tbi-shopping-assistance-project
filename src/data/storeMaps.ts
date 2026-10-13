export interface MappedAisle {
  categories: string[];
  updated: string;
}

export type StoreAisleMap = Record<number, MappedAisle>;

// Aisles someone has already photographed. Missing numbers have no photo yet.
export const storeMaps: Record<string, StoreAisleMap> = {
  hannaford: {
    1: { categories: ['Ice cream', 'Frozen meals', 'Ice'], updated: '2 days ago' },
    2: { categories: ['Pasta', 'Pasta sauce', 'Rice'], updated: '2 days ago' },
    3: { categories: ['Cookies', 'Candy', 'Snack bars', 'Juices'], updated: '4 days ago' },
    4: { categories: ['Canned vegetables', 'Beans', 'Soup'], updated: '2 days ago' },
    6: { categories: ['Cereal', 'Oatmeal', 'Breakfast bars'], updated: '1 week ago' },
    8: { categories: ['Coffee', 'Tea', 'Cocoa'], updated: '3 days ago' },
    9: { categories: ['Paper goods', 'Foil', 'Plastic wrap'], updated: '2 days ago' },
    10: { categories: ['Cleaning', 'Laundry', 'Trash bags'], updated: '5 days ago' }
  },
  coop: {
    1: { categories: ['Bulk grains', 'Nuts', 'Dried fruit'], updated: '2 days ago' },
    2: { categories: ['Pasta', 'Rice', 'Soup'], updated: '3 days ago' },
    4: { categories: ['Canned goods', 'Beans'], updated: '2 days ago' },
    5: { categories: ['Baking', 'Spices', 'Oils'], updated: '1 week ago' },
    7: { categories: ['Snacks', 'Chips', 'Crackers'], updated: '4 days ago' },
    9: { categories: ['Paper goods', 'Foil'], updated: '2 days ago' }
  }
};