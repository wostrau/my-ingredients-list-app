import React, { useEffect, useCallback, useReducer, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

const ingredientReducer = (
  currentIngredients: IngredientType[],
  action: { type: string; payload?: any }
) => {
  switch (action.type) {
    case 'SET-INGREDIENTS':
      return action.payload.ingredients;
    case 'ADD-INGREDIENT':
      return [...currentIngredients, action.payload.ingredient];
    case 'DELETE-INGREDIENT':
      return currentIngredients.filter(
        (ingredient) => ingredient.id !== action.payload.ingredientId
      );
    default:
      return currentIngredients;
  }
};

const httpReducer = (
  curHttpState: any,
  action: { type: string; payload?: any }
) => {
  switch (action.type) {
    case 'SEND':
      return { loading: true, error: null };
    case 'RESPONSE':
      return { ...curHttpState, loading: false };
    case 'ERROR':
      return { loading: false, error: action.payload.error };
    case 'CLEAR':
      return { ...curHttpState, error: null };
    default:
      return curHttpState;
  }
};

export type IngredientType = { id: string; title: string; amount: string };

const Ingredients: React.FC = () => {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    isLoading: false,
    error: null,
  });

  //const [userIngredients, setUserIngredients] = useState<IngredientType[]>([]);
  //const [isLoading, setIsLoading] = useState<boolean>(false);
  //const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    //setIsLoading(true);
    dispatchHttp({ type: 'SEND' });
    fetch(
      'https://react-http-39eeb-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json'
    )
      .then((response) => {
        //setIsLoading(false);
        dispatchHttp({ type: 'RESPONSE' });
        response.json();
      })
      .then((responseData: any) => {
        const loadedIngredients = [];

        for (const key in responseData) {
          loadedIngredients.push({
            id: key,
            title: responseData[key].title,
            amount: responseData[key].amount,
          });
        }

        //setUserIngredients(loadedIngredients);
        dispatch({
          type: 'SET-INGREDIENTS',
          payload: { ingredients: loadedIngredients },
        });
      });
  }, []);

  const addIngredientHandler = useCallback(
    (ingredient: { title: string; amount: string }) => {
      //setIsLoading(true);
      dispatchHttp({ type: 'SEND' });
      fetch(
        'https://react-http-39eeb-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json',
        {
          method: 'POST',
          body: JSON.stringify(ingredient),
          headers: { 'Content-Type': 'application/json' },
        }
      )
        .then((response) => {
          //setIsLoading(false);
          dispatchHttp({ type: 'RESPONSE' });
          response.json();
        })
        .then((responseData: { name: string } | void) => {
          // setUserIngredients((prevIngredients) => [
          //   ...prevIngredients,
          //   { id: responseData.name, ...ingredient },
          // ]);
          if (responseData && responseData.name) {
            const newIngredient = { id: responseData.name, ...ingredient };
            dispatch({
              type: 'ADD-INGREDIENT',
              payload: { ingredient: newIngredient },
            });
          }
        });
    },
    []
  );

  const removeIngredientHandler = useCallback((ingredientId: string) => {
    //setIsLoading(true);
    dispatchHttp({ type: 'SEND' });
    fetch(
      `https://react-http-39eeb-default-rtdb.europe-west1.firebasedatabase.app/ingredients/${ingredientId}.json`,
      { method: 'DELETE' }
    )
      .then((response) => {
        //setIsLoading(false);
        dispatchHttp({ type: 'RESPONSE' });
        // const filteredIngredients = userIngredients.filter(
        //   (ingredient: IngredientType) => ingredient.id !== ingredientId
        // );
        //setUserIngredients(filteredIngredients);
        dispatch({
          type: 'DELETE-INGREDIENT',
          payload: { id: ingredientId },
        });
      })
      .catch((error) => {
        //setError('Something went wrong!');
        dispatchHttp({
          type: 'ERROR',
          payload: { error: 'Something went wrong!' },
        });
        console.warn(error.message);
        //setIsLoading(false);
      });
  }, []);

  const filteredIngredientsHandler = useCallback(
    (filteredIngredients: IngredientType[]) => {
      //setUserIngredients(filteredIngredients);
      dispatch({
        type: 'SET-INGREDIENTS',
        payload: { ingredients: filteredIngredients },
      });
    },
    []
  );

  const clearError = useCallback(() => {
    //setError(null);
    //setIsLoading(false);
    dispatchHttp({ type: 'CLEAR' });
  }, []);

  const ingredientList = useMemo(() => {
    return (
      <IngredientList
        ingredients={userIngredients}
        onRemoveItem={removeIngredientHandler}
      />
    );
  }, [userIngredients, removeIngredientHandler]);

  return (
    <div className='App'>
      {httpState.error && (
        <ErrorModal children={httpState.error} onClose={clearError} />
      )}
      <IngredientForm
        onAddItem={addIngredientHandler}
        loading={httpState.loading}
      />
      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;
