import uuid from 'uuid';

// TODO: figure out how to make syncing some parts of the state
// to local storage more generic
const id = localStorage.getItem('peerId') || uuid.v4();
localStorage.setItem('peerId', id);

const initialState = {
  id,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
