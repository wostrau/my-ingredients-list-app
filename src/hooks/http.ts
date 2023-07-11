import { useReducer, useCallback } from 'react';

const initialState = {
  loading: false,
  error: null,
  data: null,
  extra: null,
  identifier: null,
};

const httpReducer = (
  curHttpState: any = initialState,
  action: { type: 'SEND' | 'RESPONSE' | 'ERROR' | 'CLEAR'; payload?: any }
) => {
  switch (action.type) {
    case 'SEND':
      return {
        ...curHttpState,
        loading: true,
        error: null,
        data: null,
        extra: null,
        identifier: action.payload.identifier,
      };
    case 'RESPONSE':
      return {
        ...curHttpState,
        loading: false,
        data: action.payload.responseData,
        extra: action.payload.extra,
      };
    case 'ERROR':
      return { ...curHttpState, loading: false, error: action.payload.error };
    case 'CLEAR':
      return curHttpState;
    default:
      return curHttpState;
  }
};

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, initialState);

  const clear = useCallback(() => {
    dispatchHttp({ type: 'CLEAR' });
  }, []);

  type methodType = 'GET' | 'PUT' | 'POST' | 'DELETE';

  const sendRequest = useCallback(
    (
      url: string,
      method: methodType = 'GET',
      body?: string | null,
      reqExtra?: any,
      reqIdentifier?: 'ADD_INGREDIENT' | 'REMOVE_INGREDIENT' | null
    ) => {
      dispatchHttp({ type: 'SEND', payload: { identifier: reqIdentifier } });

      fetch(url, {
        method: method,
        body: body,
        headers: { 'Content-Type': 'application/json' },
      })
        .then((response) => response.json())
        .then((responseData) => {
          dispatchHttp({
            type: 'RESPONSE',
            payload: {
              responseData: responseData,
              extra: reqExtra,
            },
          });
        })
        .catch((error) => {
          dispatchHttp({
            type: 'ERROR',
            payload: { error: 'Something went wrong!' },
          });
          console.warn(error.message);
        });
    },
    []
  );

  return {
    isLoading: httpState.loading,
    data: httpState.data,
    error: httpState.error,
    sendRequest: sendRequest,
    reqExtra: httpState.extra,
    reqIdentifier: httpState.identifier,
    clearError: clear,
  };
};

export default useHttp;
