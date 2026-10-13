import type { CatalogEntry } from '../types/app';

const dairyHelper = 'Along the back wall, in the coolers.';
const produceHelper = 'Fresh fruit and vegetables, near the entrance.';
const paperGoods = { kind: 'aisle', aisle: 9, label: 'Paper Goods' } as const;

export const catalog: Record<string, CatalogEntry> = {
  pasta: {
    location: { kind: 'aisle', aisle: 2, label: 'Pasta and Rice' },
    helper: 'Boxes and bags, next to the rice.'
  },
  rice: {
    location: { kind: 'aisle', aisle: 2, label: 'Pasta and Rice' },
    helper: 'Bags and boxes, next to the pasta.'
  },
  chickpeas: {
    location: { kind: 'aisle', aisle: 4, label: 'Canned Vegetables' },
    helper: 'Also called garbanzo beans. They come in cans.',
    fallback: { aisle: 7, label: 'Canned Goods' }
  },
  'canned tomatoes': {
    location: { kind: 'aisle', aisle: 4, label: 'Canned Vegetables' },
    fallback: { aisle: 7, label: 'Canned Goods' }
  },
  beans: {
    location: { kind: 'aisle', aisle: 4, label: 'Canned Vegetables' },
    fallback: { aisle: 7, label: 'Canned Goods' }
  },
  soup: { location: { kind: 'aisle', aisle: 5, label: 'Soup' } },
  cereal: { location: { kind: 'aisle', aisle: 6, label: 'Breakfast' } },
  oatmeal: { location: { kind: 'aisle', aisle: 6, label: 'Breakfast' } },
  'peanut butter': {
    location: { kind: 'aisle', aisle: 7, label: 'Canned Goods' },
    helper: 'Jars, near the jam.'
  },
  coffee: { location: { kind: 'aisle', aisle: 8, label: 'Coffee and Tea' } },
  tea: { location: { kind: 'aisle', aisle: 8, label: 'Coffee and Tea' } },
  tinfoil: {
    location: paperGoods,
    helper: 'Tinfoil is with the paper goods. Also called aluminum foil.'
  },
  'paper towels': { location: paperGoods },
  'toilet paper': { location: paperGoods },
  'dish soap': { location: { kind: 'aisle', aisle: 10, label: 'Cleaning' } },
  shampoo: { location: { kind: 'aisle', aisle: 11, label: 'Personal Care' } },
  'cat food': { location: { kind: 'aisle', aisle: 12, label: 'Pet Food' } },
  milk: { location: { kind: 'area', name: 'Dairy wall' }, helper: dairyHelper },
  eggs: { location: { kind: 'area', name: 'Dairy wall' }, helper: 'In the coolers, near the milk.' },
  butter: { location: { kind: 'area', name: 'Dairy wall' }, helper: 'In the coolers, next to the eggs.' },
  cheese: { location: { kind: 'area', name: 'Dairy wall' }, helper: dairyHelper },
  yogurt: { location: { kind: 'area', name: 'Dairy wall' }, helper: dairyHelper },
  bread: { location: { kind: 'area', name: 'Bakery' }, helper: 'Near the front, close to the checkout.' },
  bananas: { location: { kind: 'area', name: 'Produce' }, helper: produceHelper },
  apples: { location: { kind: 'area', name: 'Produce' }, helper: produceHelper },
  carrots: { location: { kind: 'area', name: 'Produce' }, helper: produceHelper }
};