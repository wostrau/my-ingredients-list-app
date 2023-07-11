import React, { useEffect, useCallback, useReducer, useMemo } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';
import useHttp from '../../hooks/http';

const ingredientReducer = (
  currentIngredients: IngredientType[],
  action: {
    type: 'SET-INGREDIENTS' | 'ADD-INGREDIENT' | 'DELETE-INGREDIENT';
    payload?: any;
  }
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

export type IngredientType = { id: string; title: string; amount: string };

const Ingredients: React.FC = () => {
  const {
    isLoading,
    error,
    data,
    sendRequest,
    reqExtra,
    reqIdentifier,
    clearError,
  } = useHttp();
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);

  //const [userIngredients, setUserIngredients] = useState<IngredientType[]>([]);
  //const [isLoading, setIsLoading] = useState<boolean>(false);
  //const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !error && reqIdentifier === 'REMOVE_INGREDIENT') {
      dispatch({ type: 'DELETE-INGREDIENT', payload: { id: reqExtra } });
    } else if (!isLoading && !error && reqIdentifier === 'ADD_INGREDIENT') {
      dispatch({
        type: 'ADD-INGREDIENT',
        payload: { ingredient: { id: data.name, ...reqExtra } },
      });
    }
  }, [data, reqExtra, reqIdentifier, isLoading, error]);

  const addIngredientHandler = useCallback(
    (ingredient: { title: string; amount: string }) => {
      sendRequest(
        'https://react-http-39eeb-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json',
        'POST',
        JSON.stringify(ingredient),
        ingredient,
        'ADD_INGREDIENT'
      );

      //   //setIsLoading(true);
      //   dispatchHttp({ type: 'SEND' });
      //   fetch(
      //     'https://react-http-39eeb-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json',
      //     {
      //       method: 'POST',
      //       body: JSON.stringify(ingredient),
      //       headers: { 'Content-Type': 'application/json' },
      //     }
      //   )
      //     .then((response) => {
      //       //setIsLoading(false);
      //       dispatchHttp({ type: 'RESPONSE' });
      //       response.json();
      //     })
      //     .then((responseData: { name: string } | void) => {
      //       // setUserIngredients((prevIngredients) => [
      //       //   ...prevIngredients,
      //       //   { id: responseData.name, ...ingredient },
      //       // ]);
      //       if (responseData && responseData.name) {
      //         const newIngredient = { id: responseData.name, ...ingredient };
      //         dispatch({
      //           type: 'ADD-INGREDIENT',
      //           payload: { ingredient: newIngredient },
      //         });
      //       }
      //     });
    },
    []
  );

  const removeIngredientHandler = useCallback(
    (ingredientId: string) => {
      sendRequest(
        `https://react-http-39eeb-default-rtdb.europe-west1.firebasedatabase.app/ingredients/${ingredientId}.json`,
        'DELETE',
        null,
        ingredientId,
        'REMOVE_INGREDIENT'
      );
    },
    [sendRequest]
  );

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
      {error && <ErrorModal children={error} onClose={clearError} />}
      <IngredientForm onAddItem={addIngredientHandler} loading={isLoading} />
      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {ingredientList}
      </section>
    </div>
  );
};

export default Ingredients;
