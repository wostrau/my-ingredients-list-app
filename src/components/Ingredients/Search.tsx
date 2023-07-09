import React, { useEffect, useRef, useState } from 'react';

import Card from '../UI/Card';
import './Search.css';
import { IngredientType } from './Ingredients';

const Search: React.FC<{
  onLoadIngredients: (ingredients: IngredientType[]) => void;
}> = React.memo((props) => {
  const { onLoadIngredients } = props;

  const [enteredFilter, setEnteredFilter] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current?.value.toString()) {
        const query =
          enteredFilter.length === 0
            ? ''
            : `?orderBy="title"&equalTo="${enteredFilter}"`;

        fetch(
          `https://react-http-39eeb-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json${query}`
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

            onLoadIngredients(loadedIngredients);
          });
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [enteredFilter, onLoadIngredients, inputRef]);

  return (
    <section className='search'>
      <Card>
        <div className='search-input'>
          <label>Filter by Title</label>
          <input
            ref={inputRef}
            type='text'
            value={enteredFilter}
            onChange={(event) => {
              setEnteredFilter(event.target.value);
            }}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
