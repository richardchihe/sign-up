import React, { useEffect, useContext, useReducer } from 'react'; 
import { Button } from '@material-ui/core';
import Container from '@material-ui/core/Container';

import { AppStateContext } from '../contexts/app.context';
import { CheckersStateContext, CheckersDispatchContext } from '../contexts/checkers.context';
import Alert from '../components/dialogs/Alert';
import Prompt from '../components/dialogs/Prompt';
import FormPrompt from '../components/dialogs/FormPrompt';
import CheckerForm from '../components/forms/CheckerForm';

const gatheringsReducer = (state, action) => {
  switch (action.type) {
    case 'setChoice': {
      return {
        ...state,
        createChoice: action.createChoice,
      };
    }
    case 'addGathering': {
      let gatherings = state.gatherings;
      gatherings.push(action.gathering);
      return {
        ...state,
        createChoice: '',
        gatherings: gatherings
      }
    }
    case 'fetchData': {
      return {
        ...state,
        selectedCycle: action.cycle,
        fetchedAt: new Date(),
        createChoice: '',
        prompt: ''
      };
    }
    case 'setPrompt': {
      return {
        ...state,
        prompt: action.prompt
      };
    }
    case 'closePrompt': {
      return {
        ...state,
        checkers: []
      };
    }
    case 'error': {
      return {
        ...state,
        isLoading: false,
        error: action.error,
      };
    }
    default: 
      break;
  }
  return state;
}

const initialState = {
  checkers: undefined,
  createChoice: '',
  isLoading: false,
  prompt: '',
  error: '',
  fetchedAt: new Date()
}
  
const Checkers = () => { 
  const [state, dispatch] = useReducer(gatheringsReducer, initialState);
  const { state: appState } = useContext(AppStateContext);

  let {
    checkers,
    createChoice,
    isLoading,
    prompt,
    error,
    fetchedAt
  } = state;

  useEffect(() => {
    document.title = "Checkers"
  }, []);

  return (
    <CheckersStateContext.Provider value={{dispatch}}>
      <CheckersDispatchContext.Provider value={{state}}>
        <>
          {error && (
            <Alert isOpen={true} message={error} close={() => {dispatch({type: 'error', error: ''})}} />
          )}
          {(appState.currentUser 
              && appState.currentUser.organizationId
              && !checkers
              && !createChoice
            ) && (
            <Prompt 
              isOpen={true}
              cancel={() => {dispatch({type: 'closePrompt'})}}
              firstChoice={{
                text: "3. Create a checker",
                subtitle: "Checkers help in confirming an attendee's presence.",
                buttonText: "Ok",
                click: () => {dispatch({type: 'setChoice', createChoice: 'checker'})}
              }}
            />
          )}
          {(createChoice === 'checker') && (
            <FormPrompt
              isOpen={true}
              title="Create Checker"
              form={<CheckerForm success={() => {dispatch({type: 'fetchData'})}} />} 
              cancel={() => {dispatch({type: 'setChoice', createChoice: ''})}}
            />
          )}
        </>
        <div style={{maxWidth: '1400px', margin: 'auto'}}>
          <div>
            <Button
              variant="outlined"
              style={{
                margin: '1em',
                marginBottom: '0px'
              }}
              onClick={() => {dispatch({type: 'setChoice', createChoice: 'checker'})}}
            >
              New Checker
            </Button>
          </div>
        </div>
      </CheckersDispatchContext.Provider>
    </CheckersStateContext.Provider>
  )
}
  
export default Checkers;