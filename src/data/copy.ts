import type { Personality } from '../types/app';

type Lines = Record<Personality, string[]>;

const loadingCheerful = [
'Rummaging through the aisles...',
'Herding the shopping carts...',
'Sniffing out the chickpeas...',
'Untangling your list...',
'Bribing the cereal box...',
'Doing a little pea dance...',
'Flibbertigibbeting...'];


const readingCheerful = [
'Squinting at the sign...',
'Sounding out the big words...',
'Sorting snacks from not-snacks...',
'Asking the cereal for directions...',
'Doing math. Pea-sized math.'];


// Jokes live in headings, toasts, loading, empty states and celebrations.
// Aisle numbers, item names, tips and button labels stay plain everywhere.
export const lines = {
  homeGreeting: {
    calm: ['Hello.'],
    cheerful: ['Hey there. Snack mission?', 'Pip is ready. Pip was born ready.', "Let's go get stuff."],
    goofy: [
    'Hey there. Snack mission?',
    'Pip is ready. Pip was born ready.',
    "Let's go get stuff.",
    'Cart? Check. Pea? Check. Rolling out.',
    'Pip did stretches for this.']

  },
  homeSub: {
    calm: ['Ready when you are.'],
    cheerful: ['Ready when you are.'],
    goofy: ['Ready when you are. Pip is extremely ready.']
  },
  emptyLists: {
    calm: ['No lists yet.'],
    cheerful: ['Nothing here yet. Pip is just twiddling its leaf.'],
    goofy: ['Nothing here yet. Pip is just twiddling its leaf. Twiddle, twiddle.']
  },
  chooseStore: {
    calm: ['Where are you shopping today?'],
    cheerful: ['Where are we headed?'],
    goofy: ['Where are we headed? Pip packed snacks.']
  },
  loading: {
    calm: ['Loading...'],
    cheerful: loadingCheerful,
    goofy: [...loadingCheerful, 'Teaching the carts to roll straight...', 'Polishing the aisle numbers...']
  },
  signReading: {
    calm: ['Reading the sign...'],
    cheerful: readingCheerful,
    goofy: [...readingCheerful, 'Pip is squinting so hard right now...', 'Consulting the ancient grocery scrolls...']
  },
  listSaved: {
    calm: ['List saved.'],
    cheerful: ['List saved. Pip memorized it.'],
    goofy: ['List saved. Pip memorized it. Mostly.']
  },
  emptyReported: {
    calm: ['Thanks for letting us know.'],
    cheerful: ['Thanks for letting us know.'],
    goofy: ['Thanks for letting us know. Pip will have a word with that shelf.']
  },
  error: {
    calm: ['Something went wrong. Try again?'],
    cheerful: ['Whoops, Pip tripped. Try again?'],
    goofy: ['Whoops, Pip tripped. Pea down. Try again?']
  },
  signStoreAsk: {
    calm: ['Which store are you in?'],
    cheerful: ['Which store are we mapping?'],
    goofy: ['Which store are we mapping? Pip brought a tiny pencil.']
  },
  captureAsk: {
    calm: ['Add a photo of the aisle sign.'],
    cheerful: ["Sign spotted? Let's grab it."],
    goofy: ["Sign spotted? Let's grab it. Say cheese, sign."]
  },
  adjustBox: {
    calm: ['Move the box around the sign if you need to.'],
    cheerful: ["Squeeze the box around the sign. Or don't, I'm pretty good at finding it."],
    goofy: ["Squeeze the box around the sign. Or don't, I'm pretty good at finding it. Usually. Mostly."]
  },
  noWordsInBox: {
    calm: ['No words inside the box. Try making it bigger.'],
    cheerful: ['Whoops, Pip tripped. There are no words in that box. Try again?'],
    goofy: ['Whoops, Pip tripped. That box is full of nothing. Try again?']
  },
  savedSub: {
    calm: ['Thank you for adding it.'],
    cheerful: ['The next shopper owes you one.'],
    goofy: ['The next shopper owes you one. Possibly a cookie.']
  },
  mapComing: {
    calm: [''],
    cheerful: ['Look at this map coming together.'],
    goofy: ['Look at this map coming together. Pip might frame it.']
  },
  reportThanks: {
    calm: ['Thanks. We will check this aisle.'],
    cheerful: ['Thanks. Pip will take a look.'],
    goofy: ['Thanks. Pip is putting on its detective hat.']
  }
} satisfies Record<string, Lines>;

export type LineKey = keyof typeof lines;

export function lineFor(key: LineKey, p: Personality): string {
  const options = lines[key][p];
  return options[Math.floor(Math.random() * options.length)];
}

export function tripPlanHeading(p: Personality, items: number, stops: number): string {
  const base = `${items} ${items === 1 ? 'item' : 'items'}, ${stops} ${stops === 1 ? 'stop' : 'stops'}.`;
  if (p === 'calm') return base;
  if (p === 'goofy') return `${base} Easy peasy, lemon squeezy.`;
  return `${base} Easy peasy.`;
}

export function gotItLine(p: Personality, itemName: string): string {
  const name = itemName.charAt(0).toUpperCase() + itemName.slice(1);
  if (p === 'calm') return `Got ${itemName.toLowerCase()}.`;
  const options = [`${name}: secured.`, 'Into the cart it goes.', 'Nice grab.'];
  if (p === 'goofy') options.push('Yoink. Got it.', `${name} has joined the party.`);
  return options[Math.floor(Math.random() * options.length)];
}

export function cantFindHeading(p: Personality, aisle?: number): string {
  if (p === 'calm') return 'No problem.';
  const lead = p === 'goofy' ? 'Sneaky one. It thinks it can hide.' : 'Sneaky one.';
  return aisle ? `${lead} Let's try aisle ${aisle}.` : lead;
}

export function tripCompleteLine(p: Personality, found: number, total: number): string {
  if (found === 0) return p === 'calm' ? 'Trip done.' : 'You made it through. That counts.';
  if (p === 'calm') return `Done. You found ${found} of ${total}.`;
  if (found === total) return p === 'goofy' ? `You did it! ${found} for ${found}. Absolute champion.` : `You did it! ${found} for ${found}.`;
  return p === 'goofy' ?
  `${found} out of ${total}. Still a legend. A leafy legend.` :
  `${found} out of ${total}. Still a legend.`;
}

export function endTripLine(p: Personality, found: number, total: number): string {
  if (p === 'calm') return `End your trip? You found ${found} of ${total}.`;
  if (p === 'goofy') return `Heading out? You got ${found} of ${total}. Pip will hold the door.`;
  return `Heading out? You got ${found} of ${total}.`;
}

export function savedTitle(p: Personality, aisles: number[]): string {
  const what = aisles.length > 1 ? `Aisles ${aisles.join(' and ')} are` : `Aisle ${aisles[0]} is`;
  if (p === 'calm') return `${what} on the map.`;
  if (p === 'goofy') return `Boom. ${what} on the map. Kaboom, even.`;
  return `Boom. ${what} on the map.`;
}