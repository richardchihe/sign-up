import React, { useEffect, useContext, useReducer } from 'react'; 
import Grid from '@material-ui/core/Grid';
import { Button } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import Alert from '../components/dialogs/Alert';
import FormPrompt from '../components/dialogs/FormPrompt';
import Prompt from '../components/dialogs/Prompt';
import OrganizationForm from '../components/forms/OrganizationForm';
import CycleForm from '../components/forms/CycleForm';
import GatheringForm from '../components/forms/GatheringForm';
import { AppStateContext } from '../contexts/app.context';
import { GatheringsStateContext, GatheringsDispatchContext } from '../contexts/gatherings.context';
import CycleService from "../services/cycle.service";
import BasicPrompt from '../components/dialogs/BasicPrompt';
import CycleContainer from '../components/containers/CycleContainer';
import GatheringContainer from '../components/containers/GatheringContainer';

const gatheringsReducer = (state, action) => {
  switch (action.type) {
    case 'field': {
      return {
        ...state,
        [action.field]: action.value,
      };
    }
    case 'setChoice': {
      return {
        ...state,
        createChoice: action.createChoice,
      };
    }
    case 'setSelectedCycle': {
      return {
        ...state,
        selectedCycle: action.cycle,
        createChoice: 'gathering',
      };
    }
    case 'closePrompt': {
      return {
        ...state,
        hasGatheringOrCycle: true
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
    case 'setCyclesAndGatherings': {
      let notEmpty = false;
      if (action.cycles.length || action.gatherings.length) {
        notEmpty = true;
      }
      return {
        ...state,
        cycles: action.cycles,
        gatherings: action.gatherings,
        hasGatheringOrCycle: notEmpty
      };
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
    case 'toggleCycleStatus': {
      if (action.cycle.isArchived) {
        return {
          ...state,
          prompt: ''
        };
      } 

      return {
        ...state,
        prompt: 'archiveCycle',
        selectedCycle: action.cycle
      };
    }
    case 'setPrompt': {
      return {
        ...state,
        prompt: action.prompt
      };
    }
    case 'setFilter': {
      return {
        ...state,
        filter: action.filter,
        fetchedAt: new Date()
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
  cycles: [],
  gatherings: [],
  hasGatheringOrCycle: false,
  createChoice: '',
  selectedCycle: null,
  isLoading: false,
  prompt: '',
  error: '',
  fetchedAt: new Date(),
  filter: 'active'
}
  
const Gatherings = () => { 
  const [state, dispatch] = useReducer(gatheringsReducer, initialState);
  const { state: appState } = useContext(AppStateContext);

  let {
    cycles,
    gatherings,
    hasGatheringOrCycle,
    createChoice,
    selectedCycle,
    isLoading,
    prompt,
    error,
    fetchedAt,
    filter
  } = state;

  useEffect(() => {
    document.title = "Gatherings";
  }, []);

  useEffect(() => {
    CycleService.getCyclesAndGatherings(
      filter,
    ).then(
      response => {
        // console.log(response);
        dispatch({type: 'setCyclesAndGatherings', cycles: response.cycles, gatherings: response.gatherings});
      },
      error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        dispatch({type: 'error', error: resMessage});
      }
    );
  }, [fetchedAt]);

  const handleClick = (action) => {
    switch (action) {
      case 'archiveSelectedCycle': {
        CycleService.toggleArchiveStatus(
          selectedCycle._id,
        ).then(
          () => {
            dispatch({type: 'fetchData', cycle: null});
          },
          error => {
            const resMessage =
              (error.response &&
                error.response.data &&
                error.response.data.message) ||
              error.message ||
              error.toString();
            dispatch({type: 'error', error: resMessage});
          }
        );
        break;
      }
      default: 
        break;
    }
  }

  return (
    <GatheringsDispatchContext.Provider value={{dispatch}}>
      <GatheringsStateContext.Provider value={{state}}>
        <>
          {error && (
            <Alert isOpen={true} message={error} close={() => {dispatch({type: 'error', error: ''})}} />
          )}
          {(appState.currentUser && !appState.currentUser.organizationId) && (
            <FormPrompt isOpen={true} title="1. Create Organization" form={<OrganizationForm />} />
          )}
          {(appState.currentUser 
              && appState.currentUser.organizationId
              && !hasGatheringOrCycle
              && !createChoice
            ) && (
            <Prompt 
              isOpen={true}
              cancel={() => {dispatch({type: 'closePrompt'})}}
              firstChoice={{
                text: "2.1. Create a cycle",
                subtitle: "Groups gatherings created in this cycle so that participants can only sign up in one gathering in the cycle.",
                buttonText: "Ok",
                click: () => {dispatch({type: 'setChoice', createChoice: 'cycle'})}
              }}
              secondChoice={{
                text: "2.2. Create a gathering", 
                subtitle: "Create a gathering outside a cycle to allow participants to signup without checking previous attendance in other gatherings.",
                buttonText: "Go",
                click: () => {dispatch({type: 'setChoice', createChoice: 'gathering'})}
              }}
            />
          )}
          {(createChoice === 'cycle') && (
            <FormPrompt
              isOpen={true}
              title="Create Cycle"
              form={<CycleForm success={(cycle) => {dispatch({type: 'setSelectedCycle', cycle: cycle})}} />} 
              cancel={() => {dispatch({type: 'setChoice', createChoice: ''})}}
            />
          )}
          {(createChoice === 'gathering') && (
            <FormPrompt 
              isOpen={true} 
              title={'Create Gathering'} 
              form={<GatheringForm success={(gathering) => {dispatch({type: 'addGathering', gathering})}} /> }
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
            onClick={() => {dispatch({type: 'setChoice', createChoice: 'cycle'})}}
          >
            New Cycle
          </Button>
          <FormControl
            style={{float: 'right', margin: '0.5em'}}
          >
            <NativeSelect
              value={filter}
              onChange={(e) => {
                dispatch({type: 'setFilter', filter: e.currentTarget.value})
              }}
              name="isArchived"
              inputProps={{ 'aria-label': 'isArchived' }}
            >
              <option value="all">All</option>
              <option value="active">Non Archived</option>
              <option value="archived">Archived</option>
            </NativeSelect>
          </FormControl>
        </div>
        
        {cycles.map((cycle) => (
          <CycleContainer key={cycle._id} cycle={cycle} />
        ))}
        </div>
        <Container style={{marginTop: '1em'}}>
          <Button
            style={{float: 'right'}}
            variant="outlined"
            onClick={() => {dispatch({type: 'setSelectedCycle', cycle: null})}}
          >
            New Gathering
          </Button>
          <Grid container spacing={2} alignItems="center">
            {gatherings.map((gathering) => (
              <GatheringContainer key={gathering._id} gathering={gathering} click={(data) => {handleClick(data)}}/>
            ))}
          </Grid>
        </Container>
      </GatheringsStateContext.Provider>
    </GatheringsDispatchContext.Provider>
  )
}
  
export default Gatherings;