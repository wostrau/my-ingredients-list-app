import React, { useState } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';

export type IngredientType = { id: string; title: string; amount: string };

const Ingredients: React.FC = () => {
  const [userIngredients, setUserIngredients] = useState<IngredientType[]>([]);

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

  return (
    <div className='App'>
      <IngredientForm onAddItem={addIngredientHandler} />

      <section>
        <Search />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;
