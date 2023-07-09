import React from 'react';

import './IngredientList.css';
import { IngredientType } from './Ingredients';

const IngredientList: React.FC<{
  ingredients: IngredientType[];
  onRemoveItem: (id: string) => void;
}> = (props) => {
  return (
    <section className='ingredient-list'>
      <h2>Loaded Ingredients</h2>
      <ul>
        {props.ingredients.map((ig) => (
          <li key={ig.id} onClick={props.onRemoveItem.bind(this, ig.id)}>
            <span>{ig.title}</span>
            <span>{ig.amount}x</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default IngredientList;
