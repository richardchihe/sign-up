import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
// import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import CheckIcon from '@material-ui/icons/Check';
import SearchIcon from '@material-ui/icons/Search';

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

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

const AttendeesTable = () => {
  const classes = useStyles();

  const handleChange = e => {
  }

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell style={{display: 'flex', alignItems: 'center'}}>
              <SearchIcon />
              <TextField
                className={classes.search}
                variant="outlined"
                margin="normal"
                name="search"
                label="Name"
                id="search"
                size="small"
                onChange={handleChange}
              />
            </TableCell>
            {/* if contact is required */}
            {/* <TableCell>Contact</TableCell> */}
            {/* if gathering is not yet final */}
            {/* <TableCell align="right">
              Actions
            </TableCell> */}
            <TableCell align="right">
              
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell style={{paddingLeft: '1em'}} padding="none" component="th" scope="row">
                {/* if gathering is ongoing */}
                <FormControlLabel
                  control={<Checkbox value="requireContact" color="primary" />}
                  label={row.name}
                />
                {/* if ended */}
                {/* {row.name} */}
              </TableCell>
              {/* if contact is required */}
              {/* <TableCell component="th" scope="row">
                {row.calories}
              </TableCell> */}
              <TableCell align="right">
                <CheckIcon /> by Checker
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default AttendeesTable