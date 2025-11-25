import {useDispatch, useSelector} from "react-redux";
import {type RootState, type AppDispatch, injectReducer, removeReducer} from "./index";
// import type {Slice} from "@reduxjs/toolkit";
import {useEffect} from "react";

export const useAppDispatch: () => AppDispatch = useDispatch;

export function useAppSelector<T>(key: string): T | undefined {
  return useSelector((state: RootState) => (state as any)[key]);
}

export function useDynamicSlice<
  State, Actions
>(
  id: string,
  // createSliceFn: (id: string) => Slice<State>
  createSliceFn: (id: string) => {
    reducer: any;
    actions: Actions;
  }
) {
  const slice = createSliceFn(id);
  useEffect(() => {
    console.log("useDynamicSlice", id)
    injectReducer(id, slice.reducer)
    return () => {
      console.log("useDynamicSlice unmount", id)
      removeReducer(id)
    }
  }, [])
  const state = useAppSelector<State>(id);
  const dispatch = useAppDispatch();
  return {
    id,
    slice,
    actions: slice.actions as Actions,
    state,
    dispatch,
  };
}
