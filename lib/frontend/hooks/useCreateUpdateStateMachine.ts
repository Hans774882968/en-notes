import { Dispatch } from 'react';
import { IHookStateSetAction } from 'react-use/lib/misc/hookState';
import { useGetSet } from 'react-use';

const SEARCH = 1;
const CREATE = 2;
const UPDATE = 3;
const FETCH_RECORD = 4;
type State = typeof SEARCH | typeof CREATE | typeof UPDATE | typeof FETCH_RECORD;
const stateToText: Record<State, string> = {
  [CREATE]: 'Create',
  [FETCH_RECORD]: 'Fetching Record',
  [SEARCH]: 'Search',
  [UPDATE]: 'Update'
};

export type StateMachine = {
  changeToCreateState: () => void
  changeToFetchRecordState: () => void
  changeToSearchState: () => void
  changeToUpdateState: () => void
  getCurrentState: () => State
  setCurrentState: Dispatch<IHookStateSetAction<State>>
  isCreateOrUpdateState: () => boolean
  isCreateState: () => boolean
  isFetchRecordState: () => boolean
  isSearchState: () => boolean
  isUpdateState: () => boolean
  getStateText: () => string
};

export default function useCreateUpdateStateMachine(): StateMachine {
  const [getCurrentState, setCurrentState] = useGetSet<State>(SEARCH);

  const getStateText = () => stateToText[getCurrentState()];

  const isSearchState = () => getCurrentState() === SEARCH;
  const isCreateState = () => getCurrentState() === CREATE;
  const isUpdateState = () => getCurrentState() === UPDATE;
  const isFetchRecordState = () => getCurrentState() === FETCH_RECORD;
  const isCreateOrUpdateState = () => isCreateState() || isUpdateState();

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

  return {
    changeToCreateState,
    changeToFetchRecordState,
    changeToSearchState,
    changeToUpdateState,
    getCurrentState,
    getStateText,
    isCreateOrUpdateState,
    isCreateState,
    isFetchRecordState,
    isSearchState,
    isUpdateState,
    setCurrentState
  };
}
