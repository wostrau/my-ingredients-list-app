import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

export type IngredientType = { id: string; title: string; amount: string };

const Ingredients: React.FC = () => {
  const [userIngredients, setUserIngredients] = useState<IngredientType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    fetch(
      'https://react-http-39eeb-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json'
    )
      .then((response) => {
        setIsLoading(false);
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

        setUserIngredients(loadedIngredients);
      });
  }, []);

  const addIngredientHandler = (ingredient: {
    title: string;
    amount: string;
  }) => {
    setIsLoading(true);
    fetch(
      'https://react-http-39eeb-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json',
      {
        method: 'POST',
        body: JSON.stringify(ingredient),
        headers: { 'Content-Type': 'application/json' },
      }
    )
      .then((response) => {
        setIsLoading(false);
        response.json();
      })
      .then((responseData: any) => {
        setUserIngredients((prevIngredients) => [
          ...prevIngredients,
          { id: responseData.name, ...ingredient },
        ]);
      });
  };

  const removeIngredientHandler = (id: string) => {
    setIsLoading(true);
    fetch(
      `https://react-http-39eeb-default-rtdb.europe-west1.firebasedatabase.app/ingredients/${id}.json`,
      { method: 'DELETE' }
    )
      .then((response) => {
        setIsLoading(false);
        const filteredIngredients = userIngredients.filter(
          (ig) => ig.id !== id
        );
        setUserIngredients(filteredIngredients);
      })
      .catch((error) => {
        setError('Something went wrong!');
        console.warn(error.message);
        setIsLoading(false)
      });
  };

  const filteredIngredientsHandler = useCallback(
    (filteredIngredients: IngredientType[]) => {
      setUserIngredients(filteredIngredients);
    },
    []
  );

  const clearError = () => {
    setError(null);
    setIsLoading(false);
  };

  return (
    <div className='App'>
      {error && <ErrorModal children={error} onClose={clearError} />}
      <IngredientForm onAddItem={addIngredientHandler} loading={isLoading} />
      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;
