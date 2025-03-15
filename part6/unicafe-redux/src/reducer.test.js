import deepFreeze from 'deep-freeze'
import counterReducer from './reducer'

describe('unicafe reducer', () => {
  const initialState = {
    good: 0,
    ok: 0,
    bad: 0
  }
  const finalState = {
    good: 10,
    ok: 50,
    bad: 1000
  }

  const getAction = (_type) => ({ type: _type })

  test('should return a proper initial state when called with undefined state', () => {
    const state = {}
    const newState = counterReducer(undefined, getAction('DO_NOTHING'))
    expect(newState).toEqual(initialState)
  })

  test('good is incremented', () => {
    const state = initialState
    deepFreeze(state)
    const newState = counterReducer(state, getAction('GOOD'))
    expect(newState).toEqual({
      good: 1,
      ok: 0,
      bad: 0
    })
  })
  test ('ok is incremented too', () => {
    const state = initialState
    deepFreeze(state)
    const newState = counterReducer(state, getAction('OK'))
    expect(newState).toEqual({
      good: 0,
      ok: 1,
      bad: 0
    })
  })
  test ('so is bad', () => {
    const state = initialState
    deepFreeze(state)
    const newState = counterReducer(state, getAction('BAD'))
    expect(newState).toEqual({
      good: 0,
      ok: 0,
      bad: 1
    })
  })
  test('and reset does work too', () => {
    const state = finalState
    deepFreeze(state)
    const newState = counterReducer(state, getAction('ZERO'))
    expect(newState).toEqual(initialState)
  })
})