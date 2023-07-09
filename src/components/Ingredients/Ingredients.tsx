import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';

export type IngredientType = { id: string; title: string; amount: string };

const Ingredients: React.FC = () => {
  const [userIngredients, setUserIngredients] = useState<IngredientType[]>([]);

  useEffect(() => {
    fetch(
      'https://react-http-39eeb-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json'
    )
      .then((response) => response.json())
      .then((responseData) => {
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
    fetch(
      'https://react-http-39eeb-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json',
      {
        method: 'POST',
        body: JSON.stringify(ingredient),
        headers: { 'Content-Type': 'application/json' },
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        setUserIngredients((prevIngredients) => [
          ...prevIngredients,
          { id: responseData.name, ...ingredient },
        ]);
      });
  };

  const removeIngredientHandler = (id: string) => {
    const filteredIngredients = userIngredients.filter((ig) => ig.id !== id);
    setUserIngredients(filteredIngredients);
  };

  const filteredIngredientsHandler = useCallback(
    (filteredIngredients: IngredientType[]) => {
      setUserIngredients(filteredIngredients);
    },
    []
  );

  return (
    <div className='App'>
      <IngredientForm onAddItem={addIngredientHandler} />

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
