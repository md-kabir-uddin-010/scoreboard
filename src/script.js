// Select DOM elements
const matchesContainer = document.getElementById("matches-container");

// action types
const INCREMENT = "increment";
const DECREMENT = "decrement";
const ADD_MATCH = "addanothermatch";
const RESET = "reset";

// action creators
const increment = ({ id, value }) => {
  return {
    type: INCREMENT,
    payload: { id, value },
  };
};

const decrement = ({ id, value }) => {
  return {
    type: DECREMENT,
    payload: { id, value },
  };
};

const add_another_match = () => {
  return {
    type: ADD_MATCH,
    payload: {
      id: Math.floor(Math.random() * 100) + Date.now(),
      score: 0,
    },
  };
};

const reset = () => {
  return {
    type: RESET,
  };
};

// initial state
const initialState = {
  matchs: [{ id: 1, score: 0 }],
};

// reducer function
function counterReducer(state = initialState, action) {
  if (action.type === INCREMENT) {
    const updatedState = {
      ...state,
      matchs: state.matchs.map((match) => {
        if (match.id === action.payload.id) {
          return {
            ...match,
            score:
              action.payload.value < 0 ? 0 : match.score + action.payload.value,
          };
        } else {
          return match;
        }
      }),
    };
    return updatedState;
  } else if (action.type === DECREMENT) {
    const updatedState = {
      ...state,
      matchs: state.matchs.map((match) => {
        if (match.id === action.payload.id) {
          return {
            ...match,
            score:
              action.payload.value < 0 || match.score < action.payload.value
                ? 0
                : match.score - action.payload.value,
          };
        } else {
          return match;
        }
      }),
    };

    return updatedState;
  } else if (action.type === ADD_MATCH) {
    const updatedState = {
      ...state,
      matchs: [
        ...state.matchs,
        {
          id: action.payload.id,
          score: action.payload.score,
        },
      ],
    };

    return updatedState;
  } else if (action.type === RESET) {
    return {
      ...state,
      matchs: state.matchs.map((match) => {
        return {
          ...match,
          score: 0,
        };
      }),
    };
  } else {
    return state;
  }
}

// create store
const store = Redux.createStore(counterReducer);

// create match element
const create_element = (match, index) => {
  const element = document.createElement("div");
  element.innerHTML = `<div class="match">
  <div class="wrapper">
    <button class="lws-delete">
      <img src="./image/delete.svg" alt="" />
    </button>
    <h3 class="lws-matchName">Match ${index + 1}</h3>
  </div>
  <div class="inc-dec">
    <form class="incrementForm">
      <h4>Increment</h4>
      <input id=${
        match.id
      } type="number" name="increment" class="lws-increment" />
    </form>
    <form class="decrementForm">
      <h4>Decrement</h4>
      <input id=${
        match.id
      } type="number" name="decrement" class="lws-decrement" />
    </form>
  </div>
  <div class="numbers">
    <h2 class="lws-singleResult">${match.score}</h2>
  </div>
</div>`;
  return element;
};

// render function
const render = () => {
  matchesContainer.innerHTML = "";
  const state = store.getState();
  state.matchs.forEach((match, index) => {
    const element = create_element(match, index);
    matchesContainer.appendChild(element);
  });
};

// render initial state
render();

// subscribe render function to store updates
store.subscribe(render);

// incremet and decrement state change
matchesContainer.addEventListener("submit", (event) => {
  event.preventDefault();
  if (event.target.matches(".incrementForm")) {
    store.dispatch(
      increment({
        id: parseInt(event.target[0].id),
        value: parseInt(event.target[0].value),
      })
    );
  } else if (event.target.matches(".decrementForm")) {
    store.dispatch(
      decrement({
        id: parseInt(event.target[0].id),
        value: parseInt(event.target[0].value),
      })
    );
  }
});

// add another match button function
const addAnotherMatch = () => {
  store.dispatch(add_another_match());
};

// reset button function
const resetMatch = () => {
  store.dispatch(reset());
};
