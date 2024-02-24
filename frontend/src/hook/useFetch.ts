import { useEffect, useState } from "react";
import { FetchError } from "../types/fetchErr";

type State<T> = [T | undefined, FetchError | undefined];

export const useFetch = <T>(
  url: string,
  withCredential: boolean = false
): State<T> => {
  const [state, setState] = useState([undefined, undefined] as State<T>);
  useEffect(() => {
    if (!url) {
      setState([undefined, new FetchError(400, "No url provided")]);
      return;
    }
    (async () => {
      try {
        const res = await fetch(url, {
          credentials: withCredential ? "include" : "omit",
        });
        if (!res.ok) {
          const err = new FetchError(res.status);
          if (typeof res.json == "function")
            res.json().then((data) => (err.data = data));
          throw err;
        }
        const data = (await res.json()) as T;
        setState([data, undefined]);
      } catch (error) {
        setState([undefined, error as FetchError]);
      }
    })();
  }, [url, withCredential]);
  return state;
};
