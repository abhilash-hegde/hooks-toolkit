"use client"

import { useReducer, useRef, useEffect, type Reducer } from "react"

type Middleware<S, A> = (
  state: S,
  action: A,
  next: (action: A) => void
) => void

/**
 * Hook that enhances useReducer with middleware support
 * 
 * @param reducer The reducer function
 * @param initialState The initial state
 * @param middlewares Array of middleware functions
 * @returns [state, dispatch] tuple
 * 
 * @example
 * ```tsx
 * // Logger middleware
 * const logger = (state, action, next) => {
 *   console.log('Prev state:', state);
 *   console.log('Action:', action);
 *   next(action);
 *   console.log('Next state:', state);
 * };
 * 
 * // Thunk middleware
 * const thunk = (state, action, next) => {
 *   if (typeof action === 'function') {
 *     action(dispatch, () => state);
 *   } else {
 *     next(action);
 *   }
 * };
 * 
 * const [state, dispatch] = useReducerWithMiddleware(
 *   reducer,
 *   initialState,
 *   [logger, thunk]
 * );
 * ```
 */
export function useReducerWithMiddleware<S, A>(
  reducer: Reducer<S, A>,
  initialState: S,
  middlewares: Middleware<S, A>[] = []
): [S, (action: A) => void] {
  const [state, dispatch] = useReducer(reducer, initialState)
  
  // Use a ref to always have the latest state in middlewares
  const stateRef = useRef(state)
  
  // Update the ref whenever state changes
  useEffect(() => {
    stateRef.current = state
  }, [state])

  // Create a dispatch function enhanced with middlewares
  const dispatchWithMiddleware = useRef((action: A) => {
    let index = -1
    
    // This function calls the next middleware in the chain
    const next = (i: number) => (action: A) => {
      if (i <= index) {
        throw new Error('next() called multiple times')
      }
      
      index = i
      
      if (i === middlewares.length) {
        // If we've gone through all middlewares, dispatch the action
        dispatch(action)
      } else {
        // Otherwise, call the next middleware
        middlewares[i](stateRef.current, action, next(i + 1))
      }
    }
    
    // Start the middleware chain
    next(0)(action)
  })

  return [state, dispatchWithMiddleware.current]
}
