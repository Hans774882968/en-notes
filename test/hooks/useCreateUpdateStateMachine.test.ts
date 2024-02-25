import { act, renderHook } from '@testing-library/react';
import useCreateUpdateStateMachine from '@/lib/frontend/hooks/useCreateUpdateStateMachine';

describe('useCreateUpdateStateMachine', () => {
  it('basic', () => {
    const { result } = renderHook(() => useCreateUpdateStateMachine());
    expect(result.current.isSearchState).toBeTruthy();
    expect(result.current.stateText).toBe('Search');
    act(() => {
      result.current.changeToCreateState();
    });
    expect(result.current.isCreateState).toBeTruthy();
    expect(result.current.isCreateOrUpdateState).toBeTruthy();
    expect(result.current.stateText).toBe('Create');
    act(() => {
      result.current.changeToFetchRecordState();
    });
    expect(result.current.isFetchRecordState).toBeTruthy();
    expect(result.current.stateText).toBe('Fetching Record');
    act(() => {
      result.current.changeToFetchedOptionsState();
    });
    expect(result.current.isFetchedOptionsState).toBeTruthy();
    expect(result.current.stateText).toBe('Fetched Options');
    act(() => {
      result.current.changeToFetchingOptionsState();
    });
    expect(result.current.isFetchingOptionsState).toBeTruthy();
    expect(result.current.stateText).toBe('Fetching Options');
    act(() => {
      result.current.changeToSearchState();
    });
    expect(result.current.isSearchState).toBeTruthy();
    expect(result.current.stateText).toBe('Search');
    act(() => {
      result.current.changeToUpdateState();
    });
    expect(result.current.isUpdateState).toBeTruthy();
    expect(result.current.isCreateOrUpdateState).toBeTruthy();
    expect(result.current.stateText).toBe('Update');
  });
});
