import { useEffect, useState } from "react";
import { useLiveQuery as _useLiveQuery } from "dexie-react-hooks";

const useLiveQuery = <T extends object>(
  query: () => Promise<T>
): T | undefined => {
  let [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  return _useLiveQuery<T | undefined>(() => {
    if (isClient) {
      return query();
    }
  }, [isClient]);
};

export default useLiveQuery;
