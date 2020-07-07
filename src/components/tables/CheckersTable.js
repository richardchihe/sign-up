import React, { useReducer, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

import Alert from '../dialogs/Alert';
import BasicPrompt from '../dialogs/BasicPrompt';
import FormPrompt from '../dialogs/FormPrompt';
import NewPassword from '../forms/NewPassword';
import CheckerService from '../../services/checker.service';
import { CheckersDispatchContext } from '../../contexts/checkers.context';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  action: {
    marginLeft: '0.5em'
  }
});

const checkersReducer = (state, action) => {
  switch (action.type) {
    case 'fetchData': {
      return {
        ...state,
        fetchedAt: new Date(),
        createChoice: '',
        prompt: ''
      };
    }
    case 'setChoice': {
      return {
        ...state,
        actionChoice: action.actionChoice,
        checker: action.checker
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
    
    case 'setErrorAndClearChoice': {
      return {
        ...state,
        isLoading: false,
        error: action.error,
        actionChoice: ''
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
  actionChoice: '',
  checker: null,
  isLoading: false,
  prompt: '',
  error: '',
  fetchedAt: new Date()
}

const CheckersTable = (props) => {
  const classes = useStyles();
  const checkers = props.checkers;
  const [state, dispatch] = useReducer(checkersReducer, initialState);
  const { dispatch: checkersDispatch } = useContext(CheckersDispatchContext);

  let {
    actionChoice,
    checker,
    error,
  } = state;

  const toggleDeletedStatus = () => {
    CheckerService.toggleDeletedStatus(
      checker._id
    ).then(
      response => {
        checkersDispatch({type: 'fetchData'});
        dispatch({type: 'setChoice', actionChoice: '', checker: null});
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
  }

  return (
    <>
      {error && (
        <Alert isOpen={true} message={error} close={() => {dispatch({type: 'error', error: ''})}} />
      )}
      {(actionChoice === 'deactivate') && (
        <BasicPrompt
          isOpen={true}
          title="Deactivate"
          message={`Deactivate ${checker.username}`}
          cancel={() => {dispatch({type: 'setChoice', actionChoice: '', checker: null})}}
          confirm={() => {toggleDeletedStatus()}}
        />
      )}
      {(actionChoice === 'reactivate') && (
        <BasicPrompt
          isOpen={true}
          title="Reactivate"
          form={`Reactivate ${checker.username}`}
          cancel={() => {dispatch({type: 'setChoice', actionChoice: '', checker: null})}}
          confirm={() => {toggleDeletedStatus()}}
        />
      )}
      {(actionChoice === 'newPassword') && (
        <FormPrompt
          isOpen={true}
          title={`Set password for ${checker.username}`}
          form={<NewPassword 
                  id={checker._id}
                  success={() => {dispatch({type: 'setErrorAndClearChoice', error: 'Successfully set new password!'})}}
                />}
          cancel={() => {dispatch({type: 'setChoice', actionChoice: ''})}}
        />
      )}
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Username</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {checkers && checkers.map((checker) => (
              <TableRow key={checker._id}>
                <TableCell component="th" scope="row">
                  {checker.username}
                </TableCell>
                <TableCell align="right">
                  {checker.softDeleted ? (
                    <Button
                      type="button"
                      variant="contained"
                      color="secondary"
                      className={classes.action}
                      onClick={() => {dispatch({type: 'setChoice', actionChoice: 'reactivate', checker})}}
                    >
                      Reactivate
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="contained"
                      className={classes.action}
                      onClick={() => {dispatch({type: 'setChoice', actionChoice: 'deactivate', checker})}}
                    >
                      Deactivate
                    </Button>
                  )}
                  
                  <Button
                    type="button"
                    variant="contained"
                    color="primary"
                    className={classes.action}
                    onClick={() => {dispatch({type: 'setChoice', actionChoice: 'newPassword', checker})}}
                  >
                    Set Password
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default CheckersTable