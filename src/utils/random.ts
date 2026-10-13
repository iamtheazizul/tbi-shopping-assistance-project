export function randomIndex(length: number, avoid?: number): number {
  if (length <= 1) return 0;
  let next = Math.floor(Math.random() * length);
  while (next === avoid) next = Math.floor(Math.random() * length);
  return next;
}