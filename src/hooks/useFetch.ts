import { useEffect, useState } from "react";

type UseFetchProps<Data, Error> = {
  url: string;
  initialState?: {
    isLoading: boolean;
    data?: Data;
    error?: Error;
  };
};

export const useFetch = <Data, Error = unknown>(
  props: UseFetchProps<Data, Error>
) => {
  const { url, initialState } = props;
  const [state, setState] = useState(initialState);

  const handleFetch = () => {
    setState((prev) => ({
      isLoading: true,
      data: prev?.data,
      error: undefined,
    }));
    fetch(url)
      .then(async (res) => {
        if (!res.ok) {
          // Response error from server (e.g. 404, 500)
          const errorText = await res.text();
          throw new Error(errorText || res.statusText);
        }
        return res.json() as Promise<Data>;
      })
      .then((data) => {
        console.log(data);
        setState({
          isLoading: false,
          data,
          error: undefined,
        });
      })
      .catch((error) => {
        console.error(error);
        setState({
          isLoading: false,
          data: undefined,
          error,
        });
      });
  };

  useEffect(() => {
    if (url) handleFetch();
  }, [url]);

  return {
    state,
    setState,
    ...state,
  };
};
