import { act, renderHook } from '@testing-library/react';
import useCreateUpdateStateMachine from '@/lib/frontend/hooks/useCreateUpdateStateMachine';

describe('useCreateUpdateStateMachine', () => {
  it('basic', () => {
    const { result } = renderHook(() => useCreateUpdateStateMachine());
    expect(result.current.isSearchState()).toBeTruthy();
    expect(result.current.getStateText()).toBe('Search');
    act(() => {
      result.current.changeToCreateState();
    });
    expect(result.current.isCreateState()).toBeTruthy();
    expect(result.current.isCreateOrUpdateState()).toBeTruthy();
    expect(result.current.getStateText()).toBe('Create');
    act(() => {
      result.current.changeToFetchRecordState();
    });
    expect(result.current.isFetchRecordState()).toBeTruthy();
    expect(result.current.getStateText()).toBe('Fetching Record');
    act(() => {
      result.current.changeToSearchState();
    });
    expect(result.current.isSearchState()).toBeTruthy();
    expect(result.current.getStateText()).toBe('Search');
    act(() => {
      result.current.changeToUpdateState();
    });
    expect(result.current.isUpdateState()).toBeTruthy();
    expect(result.current.isCreateOrUpdateState()).toBeTruthy();
    expect(result.current.getStateText()).toBe('Update');
  });

  it('Multiple changes', () => {
    const { result } = renderHook(() => useCreateUpdateStateMachine());
    expect(result.current.isSearchState()).toBeTruthy();
    act(() => {
      result.current.changeToCreateState();
      expect(result.current.isCreateState()).toBeTruthy();
      expect(result.current.isCreateOrUpdateState()).toBeTruthy();

      result.current.changeToFetchRecordState();
      expect(result.current.isFetchRecordState()).toBeTruthy();
      expect(result.current.getStateText()).toBe('Fetching Record');

      result.current.changeToUpdateState();
    });
    expect(result.current.isUpdateState()).toBeTruthy();
    expect(result.current.isCreateOrUpdateState()).toBeTruthy();
    expect(result.current.getStateText()).toBe('Update');
  });
});
