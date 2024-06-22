import React, { useContext } from 'react';
import { AuthContext } from 'App';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Typography } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Button from '@material-ui/core/Button';
import { green, yellow, red } from '@material-ui/core/colors';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 975,
    minHeight: 500,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  question: {
    minWidth: 500,
    minHeight: 300,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  checkboxContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginBottom: 8,
    marginLeft: 8,
  },
  checkbox: {
    marginRight: 8,
  }
});

const GreenCheckBox = () => (
  <Checkbox
    icon={<CheckBoxOutlineBlankIcon style={{ color: green[500] }} />}
    checkedIcon={<CheckBoxIcon style={{ color: green[500] }} />}
  />
);

const YellowCheckBox = () => (
  <Checkbox
    icon={<CheckBoxOutlineBlankIcon style={{ color: yellow[700] }} />}
    checkedIcon={<CheckBoxIcon style={{ color: yellow[700] }} />}
  />
);

const RedCheckBox = () => (
  <Checkbox
    icon={<CheckBoxOutlineBlankIcon style={{ color: red[500] }} />}
    checkedIcon={<CheckBoxIcon style={{ color: red[500] }} />}
  />
);

const Hambarger: React.FC = () => {
  const { currentUser } = useContext(AuthContext);
  const classes = useStyles();
  const bull = <span className={classes.bullet}>•</span>;

  return (
    <Card className={classes.root}>
      <CardContent>
        <Card className={classes.question}>
          <CardContent>
            <Typography variant="h5" component="h2">
              question
            </Typography>
          </CardContent>
          <div className={classes.checkboxContainer}>
            <GreenCheckBox />
            <YellowCheckBox />
            <RedCheckBox />
          </div>
        </Card>
      </CardContent>
      <Button variant='contained'>
        次の問題
      </Button>
    </Card>
  );
};

export default Hambarger;
