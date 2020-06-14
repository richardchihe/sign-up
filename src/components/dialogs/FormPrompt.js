import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import CancelIcon from '@material-ui/icons/Cancel';

const FormPrompt = (props) => {
  return (
    <div>
      <Dialog
        open={props.isOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>
          {props.title}
          {props.cancel && 
            <Button style={{float: 'right'}} onClick={props.cancel}>
              <CancelIcon />
            </Button>
          }
        </DialogTitle>
        <DialogContent>
          {props.form}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default FormPrompt;