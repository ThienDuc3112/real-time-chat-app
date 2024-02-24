import { FetchError } from "../types/fetchErr";

export const post = async <T>(
  url: string,
  option: RequestInit = {}
): Promise<[T, undefined] | [undefined, FetchError]> => {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      mode: "cors",
      ...option,
    });
    if (!res.ok) {
      const err = new FetchError(res.status);
      if (typeof res.json == "function") err.data = await res.json();
      return [undefined, err];
    }
    const json: T = await res.json();
    return [json, undefined];
  } catch (error) {
    console.log(error);
    const err = new FetchError(500, "Network error or path not found");
    err.data = error;
    return [undefined, err];
  }
};
