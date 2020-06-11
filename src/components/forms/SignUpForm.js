import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CircularProgress from '@material-ui/core/CircularProgress';

import Alert from '../dialogs/Alert';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: 'cornflowerblue',
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: 'cornflowerblue',
		height: '3em'
  },
  dialog: {
    minWidth: '300px'
  },
	loading: {
		width: '2em !important',
		height: 'auto !important'
	}
}));



const SignUpForm = () => {
  const [ message, setMessage ] = useState('');

  const classes = useStyles();

  const handleChange = e => {
  }

  const handleSubmit = async e =>  {
    e.preventDefault();
  }

  return (
    <>
      <Card className={classes.paper}>
        <CardContent>
          {message && (
            <Alert isOpen={true} message={message} close={() => {setMessage('')}} />
          )}
          <form className={classes.form} 
            onSubmit={handleSubmit}
          >
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="name"
              label="Name"
              name="name"
              autoFocus
              onChange={handleChange}
            />
            {/* if contact is required */}
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="contact"
              label="Contact"
              id="contact"
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              // disabled={this.state.loading}
            >
              Sign Up
              {/* {
                !this.state.loading ? 'Sign In' :
                  <CircularProgress className={classes.loading}/> 
              } */}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  )
}

export default SignUpForm;