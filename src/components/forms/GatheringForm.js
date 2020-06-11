import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';

import Alert from '../dialogs/Alert';

const useStyles = makeStyles((theme) => ({
  paper: {
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

const GatheringForm = () => {
  const [ message, setMessage ] = useState('');

  const today = new Date();

  const classes = useStyles();

  const handleChange = e => {
  
  }

  const handleSubmit = async e =>  {
    e.preventDefault();
  }

  return (
    <Card className={classes.paper}>
      <CardContent>
        <Typography align="center"  component="h1" variant="h5">
          Create Gathering
        </Typography>
        {message && (
          <Alert isOpen={true} message={message} close={() => {setMessage('')}} />
        )}
        <form className={classes.form} 
          onSubmit={handleSubmit}
        >
          <TextField
            variant="outlined"
            margin="normal"
            // required
            fullWidth
            id="title"
            label="Title"
            name="title"
            autoFocus
            // value={this.state.username}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            type="date"
            // required
            fullWidth
            id="date"
            label="Date"
            defaultValue={today.toISOString().split('T')[0]}
            name="date"
            // value={this.state.email}
            onChange={handleChange}
          />
          <div style={{display: 'flex', justifyContent: 'space-evenly'}}>
            <TextField
              variant="outlined"
              margin="normal"
              type="time"
              // required
              // fullWidth
              name="from"
              label="From"
              defaultValue={`${today.getHours()}:${today.getMinutes()}`}
              id="from"
              // value={this.state.password}
              onChange={handleChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              type="time"
              // required
              // fullWidth
              name="to"
              label="To"
              defaultValue={`${today.getHours() + 1}:${today.getMinutes()}`}
              id="to"
              // value={this.state.password}
              onChange={handleChange}
            />
          </div>
          
          <TextField
            variant="outlined"
            margin="normal"
            type="number"
            // required
            fullWidth
            name="capacity"
            label="Capacity"
            defaultValue={70}
            id="capacity"
            // value={this.state.password}
            onChange={handleChange}
          />
          <Typography variant="subtitle2" style={{float: 'right'}}>
            Default capacity is recommended
          </Typography>
          <TextField
            variant="outlined"
            margin="normal"
            multiline
            rows={4}
            rowsMax={4}
            // required
            fullWidth
            id="description"
            label="Description"
            name="description"
            // value={this.state.username}
            onChange={handleChange}
          />
          <FormControlLabel
            control={<Checkbox value="requireContact" color="primary" />}
            label="Require Contact"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            // disabled={this.state.loading}
          >
            Create
            {/* {
              !this.state.loading ? 'Sign Up' :
                <CircularProgress className={classes.loading}/> 
            } */}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default GatheringForm;