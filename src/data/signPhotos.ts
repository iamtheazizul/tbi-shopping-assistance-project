import type { SignPhoto, Span } from '../types/sign';

const s = (from: number, to: number): Span => ({ from, to });
const productRow = ['PRODUCT NAME', 'PRODUCT NAME'];

// Box positions are percentages of each photo, measured from the real images.
// Word cells are a grid inside each sign box matching the sign's rows and columns.
export const signPhotos: SignPhoto[] = [
{
  id: 'A',
  url: "/fdd19f4b-cdcf-4d48-90fa-d23ca37020e3.png",
  alt: 'Yellow and black sign for aisle 3: cookies, candy, baby food, juices, snack bars, sports drinks',
  outcome: 'success',
  confidence: 'very',
  mood: 'happy',
  message: {
    calm: 'Aisle 3 found.',
    cheerful: 'Got it! Aisle 3 is the snack aisle. Pip approves.',
    goofy: 'Got it! Aisle 3 is the snack aisle. Pip approves. Pip is drooling a little.'
  },
  signs: [
  {
    aisle: 3,
    box: { x: 24, y: 21, w: 56, h: 26 },
    number: { x: s(0.45, 0.56), y: s(0.04, 0.3) },
    cols: [s(0.045, 0.49), s(0.59, 0.965)],
    rows: [s(0.32, 0.47), s(0.56, 0.71), s(0.78, 0.94)],
    grid: [
    ['COOKIES', 'JUICES'],
    ['CANDY', 'SNACK BARS'],
    ['BABY FOOD', 'SPORTS DRINKS']],

    guesses: ['Oreos', 'Granola bars', 'Gatorade', 'Apple juice']
  }]

},
{
  id: 'B',
  url: "/e6428e39-a095-4cbe-ae3c-3097a2e466d1.png",
  alt: 'Red Super Save sign for aisle 5: breads and crumbs, chips, dairy and eggs, beverages',
  outcome: 'question',
  confidence: 'kinda',
  mood: 'confused',
  message: {
    calm: 'Aisle 5 found. One question:',
    cheerful: 'Read it! Quick question for you:',
    goofy: 'Read it! Quick question. Pip is overthinking this:'
  },
  signs: [
  {
    aisle: 5,
    box: { x: 22.2, y: 35.2, w: 61.2, h: 22.9 },
    number: { x: s(0.44, 0.56), y: s(0.3, 0.65) },
    cols: [s(0.035, 0.41), s(0.6, 0.98)],
    rows: [s(0.28, 0.53), s(0.67, 0.9)],
    grid: [
    ['Breads/Crumbs', 'Dairy/Eggs'],
    ['Chips', 'Beverages']],

    guesses: ['Breadcrumbs', 'Potato chips', 'Eggs', 'Sparkling water']
  }]

},
{
  id: 'C',
  url: "/d3154b67-2ed9-4a9c-86f8-93b3a09c054a.png",
  alt: 'Two yellow aisle signs side by side, aisle 1 and aisle 2',
  outcome: 'multi',
  confidence: 'very',
  mood: 'excited',
  message: {
    calm: 'Two signs found. Which one are you adding?',
    cheerful: 'Whoa, two signs! Which one are you adding?',
    goofy: 'Whoa, two signs! Double the signs, double the fun. Which one are you adding?'
  },
  signs: [
  {
    aisle: 1,
    box: { x: 6, y: 34, w: 27.6, h: 13 },
    number: { x: s(0.44, 0.56), y: s(0.02, 0.28) },
    cols: [s(0.03, 0.42), s(0.57, 0.99)],
    rows: [s(0.26, 0.47), s(0.51, 0.69), s(0.74, 0.93)],
    grid: [
    ['ICE CREAM', 'OILS'],
    ['CONES & TOPPINGS', 'SOUPS'],
    ['ICE', 'BROTHS']],

    guesses: ['Vanilla ice cream', 'Waffle cones', 'Olive oil', 'Chicken broth']
  },
  {
    aisle: 2,
    box: { x: 61.4, y: 32.1, w: 34.3, h: 14.3 },
    number: { x: s(0.45, 0.55), y: s(0.03, 0.3) },
    cols: [s(0.02, 0.41), s(0.57, 0.99)],
    rows: [s(0.23, 0.43), s(0.48, 0.68), s(0.73, 0.91)],
    grid: [
    ['KETCHUP & MUSTARD', 'SALAD DRESSINGS'],
    ['BBQ SAUCE & MAYO', 'CROUTONS'],
    ['OLIVES', 'PRODUCE']],

    guesses: ['Ketchup', 'Mayo', 'Ranch dressing', 'Croutons']
  }]

},
{
  id: 'D',
  url: "/5d226322-884e-4cd5-ae20-fad2bf0477b2.png",
  alt: 'Green signs with no aisle number: granola bars, fruit snacks, hot cereal, toys, games, bicycle needs',
  outcome: 'noNumber',
  confidence: 'kinda',
  mood: 'confused',
  message: {
    calm: 'No aisle number on this sign. Which aisle is this?',
    cheerful: "I can read the words, but there's no aisle number. Which aisle is this?",
    goofy: "I can read the words, but there's no aisle number. Pip checked behind the sign. Nothing. Which aisle is this?"
  },
  signs: [
  {
    aisle: null,
    box: { x: 21.3, y: 1.8, w: 60.4, h: 24.5 },
    cols: [s(0, 0.475), s(0.52, 1)],
    rows: [s(0.02, 0.29), s(0.36, 0.64), s(0.71, 0.99)],
    grid: [
    ['Granola Bars', 'Toys'],
    ['Fruit Snacks', 'Games'],
    ['Hot Cereal', 'Bicycle Needs']],

    guesses: ['Oatmeal', 'Fruit snacks', 'Board games', 'Bike pump']
  }]

},
{
  id: 'E',
  url: "/6ad702d6-92f9-4e73-a0a9-9e826bd7ee92.png",
  alt: 'Red display signs where every line says PRODUCT NAME',
  outcome: 'unreadable',
  confidence: 'guessing',
  mood: 'confused',
  message: {
    calm: "These signs don't show real product names. Try another photo or type it in.",
    cheerful: "These signs all say 'PRODUCT NAME'. Very mysterious. Not very helpful.",
    goofy: "These signs all say 'PRODUCT NAME'. Very mysterious. Not very helpful. Pip is a pea, not a detective."
  },
  signs: [
  {
    aisle: 5,
    box: { x: 0, y: 11.2, w: 28, h: 29.4 },
    number: { x: s(0.23, 0.46), y: s(0, 0.3) },
    cols: [s(0, 0.28), s(0.36, 1)],
    rows: [s(0.34, 0.48), s(0.52, 0.66), s(0.69, 0.83), s(0.85, 0.99)],
    grid: [productRow, productRow, productRow, productRow],
    guesses: []
  },
  {
    aisle: 5,
    box: { x: 44.2, y: 25.3, w: 17.1, h: 19.9 },
    number: { x: s(0.45, 0.68), y: s(0.02, 0.25) },
    cols: [s(0.03, 0.48), s(0.52, 0.97)],
    rows: [s(0.29, 0.45), s(0.47, 0.64), s(0.65, 0.82), s(0.84, 0.98)],
    grid: [productRow, productRow, productRow, productRow],
    guesses: []
  }]

}];


export const confidenceLine = {
  very: 'Pip is very sure',
  kinda: 'Pip is kinda sure',
  guessing: 'Pip is guessing, double check this one'
} as const;

/** Pip pretends to have added a few before. */
export const startingSignsAdded = 3;