import { useState } from 'react';

const SEARCH = 1;
const CREATE = 2;
const UPDATE = 3;
const FETCH_RECORD = 4;
const FETCHING_OPTIONS = 5;
const FETCHED_OPTIONS = 6;
type State = typeof SEARCH | typeof CREATE | typeof UPDATE | typeof FETCH_RECORD
  | typeof FETCHING_OPTIONS | typeof FETCHED_OPTIONS;
const stateToText: Record<State, string> = {
  [CREATE]: 'Create',
  [FETCHED_OPTIONS]: 'Fetched Options',
  [FETCHING_OPTIONS]: 'Fetching Options',
  [FETCH_RECORD]: 'Fetching Record',
  [SEARCH]: 'Search',
  [UPDATE]: 'Update'
};

export default function useCreateUpdateStateMachine() {
  const [currentState, setCurrentState] = useState<State>(SEARCH);

  const stateText = stateToText[currentState];

  const isSearchState = currentState === SEARCH;
  const isCreateState = currentState === CREATE;
  const isUpdateState = currentState === UPDATE;
  const isFetchRecordState = currentState === FETCH_RECORD;
  const isFetchingOptionsState = currentState === FETCHING_OPTIONS;
  const isFetchedOptionsState = currentState === FETCHED_OPTIONS;
  const isCreateOrUpdateState = isCreateState || isUpdateState;

  function changeToSearchState() {
    setCurrentState(SEARCH);
  }

  function changeToCreateState() {
    setCurrentState(CREATE);
  }

  function changeToUpdateState() {
    setCurrentState(UPDATE);
  }

  function changeToFetchRecordState() {
    setCurrentState(FETCH_RECORD);
  }

  function changeToFetchingOptionsState() {
    setCurrentState(FETCHING_OPTIONS);
  }

  function changeToFetchedOptionsState() {
    setCurrentState(FETCHED_OPTIONS);
  }

  return {
    changeToCreateState,
    changeToFetchRecordState,
    changeToFetchedOptionsState,
    changeToFetchingOptionsState,
    changeToSearchState,
    changeToUpdateState,
    currentState,
    isCreateOrUpdateState,
    isCreateState,
    isFetchRecordState,
    isFetchedOptionsState,
    isFetchingOptionsState,
    isSearchState,
    isUpdateState,
    setCurrentState,
    stateText
  };
}
