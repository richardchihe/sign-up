import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import CancelIcon from '@material-ui/icons/Cancel';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    overflow: 'hidden',
    padding: theme.spacing(0, 3),
  },
  paper: {
    maxWidth: 600,
    margin: `${theme.spacing(1)}px auto`,
    padding: theme.spacing(2),
  },
}));

const Alert = (props) => {
  const classes = useStyles();

  return (
    <div>
      <Dialog
        open={props.isOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        style={{width: '-webkit-fill-available'}}
      >
        <DialogTitle>
          {props.firstChoice.text}
          {props.cancel && 
            <Button style={{float: 'right'}} onClick={props.cancel}>
              <CancelIcon />
            </Button>
          }
        </DialogTitle>
        <DialogContent>
          <Paper className={classes.paper}>
            <Grid container wrap="nowrap" spacing={2}>
              <Grid item xs zeroMinWidth>
                <Typography>{props.firstChoice.subtitle}</Typography>
              </Grid>
              <Grid item>
                <Button 
                  fullWidth
                  variant="contained"
                  color="primary"
                  style={{height: '100%'}}
                  onClick={props.firstChoice.click}
                >
                  {props.firstChoice.buttonText}
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </DialogContent>
        {props.secondChoice && (
          <>
          <Typography  align="center" variant="subtitle1">OR</Typography>
          <DialogTitle>{props.secondChoice.text}</DialogTitle>
          <DialogContent>
            <Paper className={classes.paper}>
              <Grid container wrap="nowrap" spacing={2}>
                <Grid item xs zeroMinWidth>
                  <Typography>{props.secondChoice.subtitle}</Typography>
                </Grid>
                <Grid item>
                  <Button 
                    fullWidth
                    variant="contained"
                    color="primary"
                    style={{height: '100%'}}
                    onClick={props.secondChoice.click}
                  >
                    {props.secondChoice.buttonText}
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </DialogContent>
          </>
        )}
      </Dialog>
    </div>
  )
}

export default Alert;