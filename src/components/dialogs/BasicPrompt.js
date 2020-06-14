import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const BasicPrompt = (props) => {
  return (
    <div>
      <Dialog
        open={props.isOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{justifyContent: 'space-around'}}>
          <Button variant="outlined" onClick={props.cancel} color="primary" autoFocus>
            No
          </Button>
          <Button variant="outlined" onClick={props.confirm} color="secondary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default BasicPrompt;