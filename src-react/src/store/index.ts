import { configureStore, combineReducers, type Reducer } from "@reduxjs/toolkit"
import {devToolsEnhancer} from "@redux-devtools/remote";

const staticReducers = {} as Record<string, Reducer>
const asyncReducers = {} as Record<string, Reducer>

function createReducer() {
  if (Object.keys(staticReducers).length === 0 && Object.keys(asyncReducers).length === 0) {
    return (state = {}) => state
  }
  return combineReducers({
    ...staticReducers,
    ...asyncReducers,
  })
}

export const store = configureStore({
  reducer: createReducer(),
  devTools: false,
  enhancers: (getDefaultEnhancers) => getDefaultEnhancers().concat(devToolsEnhancer({
    name: "DcpCu",
    realtime: true,
    trace: true,
    maxAge: 1000,
    hostname: "localhost",
    port: 8001
  }))
})

export function injectReducer(key: string, reducer: Reducer) {
  if (asyncReducers[key]) return
  asyncReducers[key] = reducer
  store.replaceReducer(createReducer())
}

export function removeReducer(key: string) {
  if (!asyncReducers[key]) return
  delete asyncReducers[key]
  store.replaceReducer(createReducer())
}

// export function useInjectReducer(
//   key: string,
//   reducer: Reducer,
//   removeOnUnmount = true
// ) {
//   useEffect(() => {
//     injectReducer(key, reducer)
//     return () => {
//       if (removeOnUnmount) {
//         removeReducer(key)
//       }
//     }
//   }, [key, reducer])
// }

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

