import { useState } from 'react';

const SEARCH_WORD = 1;
const CREATE_WORD = 2;
const UPDATE_WORD = 3;
type State = typeof SEARCH_WORD | typeof CREATE_WORD | typeof UPDATE_WORD;
const stateToText: Record<State, string> = {
  [CREATE_WORD]: 'Create Word',
  [SEARCH_WORD]: 'Search Word',
  [UPDATE_WORD]: 'Update Word'
};

export default function useCreateUpdateInOne() {
  const [currentState, setCurrentState] = useState<State>(SEARCH_WORD);

  const stateText = stateToText[currentState];

  const isSearchWordState = currentState === SEARCH_WORD;
  const isCreateWordState = currentState === CREATE_WORD;
  const isUpdateWordState = currentState === UPDATE_WORD;

  function changeToSearchWordState() {
    setCurrentState(SEARCH_WORD);
  }

  function changeToCreateWordState() {
    setCurrentState(CREATE_WORD);
  }

  function changeToUpdateWordState() {
    setCurrentState(UPDATE_WORD);
  }

  return {
    changeToCreateWordState,
    changeToSearchWordState,
    changeToUpdateWordState,
    currentState,
    isCreateWordState,
    isSearchWordState,
    isUpdateWordState,
    setCurrentState,
    stateText
  };
}
