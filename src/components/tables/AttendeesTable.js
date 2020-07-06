import React, { useEffect, useContext, useReducer } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';

import { AppStateContext } from '../../contexts/app.context';
import AttendeeService from '../../services/attendee.service';
import { ExportCSV } from '../utils/ExportCSV';

const useStyles = makeStyles({
  table: {
    minWidth: 500,
  },
  action: {
    marginLeft: '0.5em'
  },
  search: {
    margin: '0px'
  }
});

const attendessReducer = (state, action) => {
  switch (action.type) {
    case 'setAttendees': {
      return {
        ...state,
        attendees: action.attendees
      };
    }
    case 'setAttendeesCSV': {
      return {
        ...state,
        attendeesCSV: action.attendees
      };
    }
    case 'fetchData': {
      return {
        ...state,
        fetchedAt: new Date(),
        prompt: ''
      };
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
  attendees: [],
  attendeesCSV: [],
  isLoading: false,
  prompt: '',
  error: '',
  fetchedAt: new Date()
}

const AttendeesTable = (props) => {
  const classes = useStyles();
  const [state, dispatch] = useReducer(attendessReducer, initialState);
  const { state: appState } = useContext(AppStateContext);

  let {
    attendees,
    attendeesCSV,
    isLoading,
    prompt,
    error,
    fetchedAt
  } = state;

  useEffect(() => {
    document.title = "Gatherings";
  }, []);

  useEffect(() => {
    if (attendees) {
      let tempArray = [];
      attendees.forEach((attendee) => {
        let {name, contact, hasAttended} = attendee
        tempArray.push({name, contact, hasAttended});
      });
      dispatch({type: 'setAttendeesCSV', attendees: tempArray});
    }
  }, [attendees]);

  useEffect(() => {
    AttendeeService.getAttendees(
      props.gathering._id,
    ).then(
      response => {
        dispatch({type: 'setAttendees', attendees: response});
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

  const toggleCheck = (attendee) => {
    AttendeeService.toggleAttendedStatus(
      attendee._id,
      !attendee.hasAttended,
      appState.currentUser.username
    ).then(
      response => {
        dispatch({type: 'fetchData'});
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
      <ExportCSV csvData={attendeesCSV} fileName={`${props.gathering.title}`} />
      <TableContainer component={Paper}>
        
        <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>
                Name
              </TableCell>
              <TableCell>Contact</TableCell>
              <TableCell align="right">
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendees.map((attendee) => (
              <TableRow key={attendee.name}>
                <TableCell style={{paddingLeft: '1em'}} padding="none" scope="row">
                  <FormControlLabel
                    control={
                      <Checkbox 
                        color="primary" 
                        checked={attendee.hasAttended}
                        onChange={() => {toggleCheck(attendee)}}
                      />
                    }
                    label={attendee.name}
                  />
                </TableCell>
                <TableCell scope="row">
                  {attendee.contact}
                </TableCell>
                <TableCell align="right">
                  {(attendee.removedBy && !attendee.hasAttended) ? (
                    <>
                      <ClearIcon /> by {attendee.removedBy}
                    </>
                  ) : attendee.checkedBy ? (
                    <>
                      <CheckIcon /> by {attendee.checkedBy}
                    </>
                  ) : (
                    <></>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default AttendeesTable