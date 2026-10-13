import React from 'react';
import { useNav } from '../contexts/NavigationContext';
import { tabs } from '../data/tabs';

export function TabBar() {
  const nav = useNav();

  return (
    <nav aria-label="Main" className="shrink-0 border-t-2 border-line bg-card px-2 pb-6 pt-2">
      <ul className="grid grid-cols-4">
        {tabs.map(({ label, root, icon: Icon }) => {
          const active = nav.root === root;
          return (
            <li key={root}>
              <button
                type="button"
                aria-current={active ? 'page' : undefined}
                onClick={() => {
                  if (!active) nav.switchTab(root);else
                  if (nav.depth > 1) nav.setStack([root], -1);
                }}
                className="flex min-h-[60px] w-full flex-col items-center justify-center gap-1">
                
                <span
                  className={`flex h-9 w-14 items-center justify-center rounded-full transition-colors duration-150 ease-out ${
                  active ? 'bg-primary-soft text-ink' : 'text-ink-soft'}`
                  }>
                  
                  <Icon aria-hidden size={24} strokeWidth={active ? 2.5 : 2} />
                </span>
                <span className={`whitespace-nowrap text-[14px] ${active ? 'font-extrabold text-ink' : 'font-bold text-ink-soft'}`}>
                  {label}
                </span>
              </button>
            </li>);

        })}
      </ul>
    </nav>);

}