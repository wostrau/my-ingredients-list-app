import React, { useEffect, useRef, useState } from 'react';

import Card from '../UI/Card';
import './Search.css';
import { IngredientType } from './Ingredients';
import useHttp from '../../hooks/http';
import ErrorModal from '../UI/ErrorModal';

const Search: React.FC<{
  onLoadIngredients: (ingredients: IngredientType[]) => void;
}> = React.memo((props) => {
  const { onLoadIngredients } = props;
  const [enteredFilter, setEnteredFilter] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { isLoading, data, error, sendRequest, clearError } = useHttp();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current?.value.toString()) {
        const query =
          enteredFilter.length === 0
            ? ''
            : `?orderBy="title"&equalTo="${enteredFilter}"`;

        sendRequest(
          `https://react-http-39eeb-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json${query}`,
          'GET'
        );
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [enteredFilter, inputRef, sendRequest]);

  useEffect(() => {
    if (!isLoading && !error && data) {
      const loadedIngredients = [];
      for (const key in data) {
        loadedIngredients.push({
          id: key,
          title: data[key].title,
          amount: data[key].amount,
        });
      }
      onLoadIngredients(loadedIngredients);
    }
  }, [isLoading, data, error, onLoadIngredients]);

  return (
    <section className='search'>
      {error && <ErrorModal children={error} onClose={clearError} />}
      <Card>
        <div className='search-input'>
          <label>Filter by Title</label>
          {isLoading && <span style={{ color: 'grey' }}>Loading...</span>}
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
