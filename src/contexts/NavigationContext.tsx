import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { NavDirection, ScreenName } from '../types/app';

interface NavState {
  stack: ScreenName[];
  direction: NavDirection;
}

interface NavValue {
  current: ScreenName;
  root: ScreenName;
  depth: number;
  direction: NavDirection;
  push: (screen: ScreenName) => void;
  replace: (screen: ScreenName) => void;
  back: () => void;
  popTo: (screen: ScreenName) => void;
  setStack: (stack: ScreenName[], direction?: NavDirection) => void;
  switchTab: (root: ScreenName) => void;
}

const NavigationContext = createContext<NavValue | null>(null);

export function NavigationProvider({ children }: {children: React.ReactNode;}) {
  const [state, setState] = useState<NavState>({ stack: ['splash'], direction: 0 });

  const push = useCallback((screen: ScreenName) => {
    setState((prev) => ({ stack: [...prev.stack, screen], direction: 1 }));
  }, []);

  const replace = useCallback((screen: ScreenName) => {
    setState((prev) => ({ stack: [...prev.stack.slice(0, -1), screen], direction: 1 }));
  }, []);

  const back = useCallback(() => {
    setState((prev) => prev.stack.length > 1 ? { stack: prev.stack.slice(0, -1), direction: -1 } : prev);
  }, []);

  const popTo = useCallback((screen: ScreenName) => {
    setState((prev) => {
      const index = prev.stack.lastIndexOf(screen);
      return index === -1 ? prev : { stack: prev.stack.slice(0, index + 1), direction: -1 };
    });
  }, []);

  const setStack = useCallback((stack: ScreenName[], direction: NavDirection = 1) => {
    setState({ stack, direction });
  }, []);

  const switchTab = useCallback((root: ScreenName) => {
    setState({ stack: [root], direction: 0 });
  }, []);

  const value = useMemo<NavValue>(
    () => ({
      current: state.stack[state.stack.length - 1],
      root: state.stack[0],
      depth: state.stack.length,
      direction: state.direction,
      push,
      replace,
      back,
      popTo,
      setStack,
      switchTab
    }),
    [state, push, replace, back, popTo, setStack, switchTab]
  );

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
}

export function useNav(): NavValue {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error('useNav must be used inside NavigationProvider');
  return ctx;
}