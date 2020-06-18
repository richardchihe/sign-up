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
import VisibilityIcon from '@material-ui/icons/Visibility';

import Alert from '../dialogs/Alert';
import FormPrompt from '../dialogs/FormPrompt';
import GatheringForm from '../forms/GatheringForm';
import { GatheringsStateContext, GatheringsDispatchContext } from '../../contexts/gatherings.context';
import CycleService from "../../services/cycle.service";
import BasicPrompt from '../dialogs/BasicPrompt';
import GatheringContainer from './GatheringContainer';

const cycleReducer = (state, action) => {
  switch (action.type) {
    case 'setCycle': {
      return {
        ...state,
        cycle: action.cycle,
        prompt: ''
      };
    }
    case 'archiveCycle': {
      return {
        ...state,
        prompt: 'archive'
      };
    }
    case 'setChoice': {
      return {
        ...state,
        formChoice: action.formChoice,
      };
    }
    case 'addGathering': {
      let gatherings = state.cycle.gatherings;
      gatherings.push(action.gathering);
      return {
        ...state,
        formChoice: '',
        cycle: {...state.cycle, gatherings}
      }
    }
    case 'setPrompt': {
      return {
        ...state,
        prompt: action.prompt
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
  cycle: null,
  formChoice: '',
  isLoading: false,
  prompt: '',
  error: ''
}
  
const CycleContainer = (props) => { 
  const [state, dispatch] = useReducer(cycleReducer, initialState);

  let {
    cycle,
    formChoice,
    isLoading,
    prompt,
    error
  } = state;

  useEffect(() => {
    dispatch({type: 'setCycle', cycle: props.cycle});
  }, []);

  const handleClick = (action) => {
    switch (action) {
      case 'toggleArchiveCycle': {
        CycleService.toggleArchiveStatus(
          cycle._id,
        ).then(
          response => {
            dispatch({type: 'setCycle', cycle: response});
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
    <>
      {error && (
        <Alert isOpen={true} message={error} close={() => {dispatch({type: 'error', error: ''})}} />
      )}
      {(prompt === 'archive') && (
        <BasicPrompt
          isOpen={true}
          title={`Archive cycle ${cycle.title}`}
          message={"Are you sure? This will also archive all gatherings in this cycle."}
          cancel={() => dispatch({type: 'setPrompt', prompt: ''})}
          confirm={() => {handleClick('toggleArchiveCycle')}}
        />
      )}
      {(formChoice === 'gathering') && (
        <FormPrompt 
          isOpen={true} 
          title={`Create Gathering for ${cycle.title}`} 
          form={
            <GatheringForm 
              cycleId={cycle._id}
              success={(gathering) => {dispatch({type: 'addGathering', gathering})}}
            />
          }
          cancel={() => {dispatch({type: 'setChoice', formChoice: ''})}}
        />
      )}
      {cycle && (
        <div 
          style={{
            padding: "0.5em",
          }}
        >
          <FormGroup row style={{justifyContent: 'space-between'}}>
            <Typography align="center" variant="h6">
              {cycle.title}
              <a href={`/signup/cycle/${cycle._id}`} target="_blank">
                <Button>
                  <VisibilityIcon />
                </Button>
              </a>
            </Typography>
            <FormControlLabel
              style={{flexDirection: 'row-reverse'}}
              control={
                <Switch
                  checked={!cycle.isArchived}
                  onChange={
                    () => {
                      if (cycle.isArchived) {
                        handleClick('toggleArchiveCycle');
                      } else {
                        dispatch({type: 'archiveCycle', cycle});
                      }
                    }
                  }
                  name="cycle"
                  color="primary"
                />
              }
              label={cycle.isArchived ? "Archived" : "Active"}
            />
          </FormGroup>
          <Typography 
            component="div" 
            style={{
              borderStyle: "solid",
              borderWidth: "2px",
              borderRadius: "0.5em",
              borderColor: cycle.isArchived ? "darkgray" : "mediumseagreen",
              padding: "0.5em",
              paddingBottom: "1em",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <Button
              variant="outlined"
              style={{
                marginBottom: '.5em'
              }}
              disabled={cycle.isArchived}
              onClick={() => {dispatch({type: 'setChoice', formChoice: 'gathering'})}}
            >
              New Gathering for {cycle.title}
            </Button>
            {cycle.gatherings && (
              <Grid 
                style={{alignItems: 'center'}}
                container 
                spacing={2} 
                alignItems="flex-end">
                {cycle.gatherings.map((gathering) => (
                  <GatheringContainer key={gathering._id} gathering={gathering} click={(data) => {handleClick(data)}}/>
                ))}
              </Grid>
            )}
          </Typography>
        </div>
      )}
    </>
  )
}
  
export default CycleContainer;