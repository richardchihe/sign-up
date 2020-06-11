import React from 'react'; 
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import VisibilityIcon from '@material-ui/icons/Visibility';

const useStyles = makeStyles((theme) => ({
  cardHeader: {
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[700],
  },
  cardPricing: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: theme.spacing(2),
  },
  cardContent: {
    minHeight: '220px',
    flexDirection: 'column',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  view: {
    minWidth: 'fit-content',
    padding: '0px'
  }
}));

const GatheringContainer = (props) => { 
  const classes = useStyles();

  const tier = props.meeting;

  return (
    <Grid item key={tier.title} xs={12} sm={6} md={4}>
      <Card>
        <CardHeader
          title={tier.title}
          subheader={tier.subheader}
          titleTypographyProps={{ align: 'center' }}
          subheaderTypographyProps={{ variant: 'h6', align: 'center' }}
          action={true ? (
            <Button className={classes.view}>
              <VisibilityIcon />
            </Button>
          ) : null}
          className={classes.cardHeader}
        />
        <CardContent className={classes.cardContent}>
          <div className={classes.cardPricing}>
            <Typography component="h2" variant="h3" color="textPrimary">
              {tier.mainContent}
            </Typography>
          </div>
          <ul>
            <Typography component="li" variant="subtitle1" align="center">
              {`${tier.from} - ${tier.to}`}
            </Typography>
            <hr />
            {tier.description.map((line) => (
              <Typography component="li" variant="subtitle1" align="center" key={line}>
                {line}
              </Typography>
            ))}
          </ul>
        </CardContent>
        <CardActions>
          <Button fullWidth variant={tier.buttonVariant} color="primary" onClick={() => {props.click(tier.title)}}>
            {tier.buttonText}
          </Button>
        </CardActions>
      </Card>
    </Grid>
  )
}
  
export default GatheringContainer;