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
    setUserIngredients((prevIngredients) => [
      ...prevIngredients,
      { id: Math.random().toString(), ...ingredient },
    ]);
  };

  const removeIngredientHandler = (id: string) => {
    const filteredIngredients = userIngredients.filter((ig) => ig.id !== id);
    setUserIngredients(filteredIngredients);
  };

  return (
    <div className='App'>
      <IngredientForm onAddItem={addIngredientHandler}/>

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
