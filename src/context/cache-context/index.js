import _ from 'lodash';
import { createContext, useContext, useMemo } from 'react';
import { useImmer } from 'use-immer';

const CacheContext = createContext({});

export function CacheProvider({ children }) {
  const [cache, setCache] = useImmer({});

  const push = (path, value) => {
    setCache((currentCache) => {
      _.set(currentCache, path, value);
    });
  };

  const select = (path, defaultValue) => {
    return _.get(cache, path ?? '', defaultValue);
  };

  return <CacheContext.Provider value={{ push, select, cache }}>{children}</CacheContext.Provider>;
}

export const useCacheContext = () => {
  const ctx = useContext(CacheContext);
  if (!ctx) throw new Error('useCacheContext can only be used within the CacheProvider component');
  return ctx;
};

export const useCacheData = (path, defaultValue) => {
  const { cache, select } = useCacheContext();
  return useMemo(() => {
    return select(path, defaultValue);
  }, [cache, path]);
};
