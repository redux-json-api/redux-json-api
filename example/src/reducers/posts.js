import { createAction, handleActions } from 'redux-actions';
import Imm from 'immutable';

const SET_NEXT_URL = 'SET_NEXT_URL';

export const setNextUrl = createAction(SET_NEXT_URL);

export const reducer = handleActions({
  [SET_NEXT_URL]: (state, { payload }) => (
    Imm.fromJS(state)
      .update('nextUrl', () => payload)
      .toJS()
  )
}, {
  post: {
    value: '',
    createe: null
  }
});
