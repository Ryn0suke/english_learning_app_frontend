import React from 'react';
import Button from '@material-ui/core/Button';
import { ButtonProps } from '@material-ui/core/Button';
import { makeStyles, Theme } from '@material-ui/core/styles';

interface CommonButtonProps extends ButtonProps {
    onClick: ((...args: any[]) => any);
    children: React.ReactNode;
    type?: 'button' | 'submit';
}

const CommonButton: React.FC<CommonButtonProps> = ({ onClick, children, variant = 'contained', color = 'primary', type = 'button', ...props }) => {

  const useStyles = makeStyles((theme: Theme) => ({
    button: {
      background: color === 'primary' ? theme.palette.primary.main : theme.palette.secondary.main,
      color: 'white',
      '&:hover': {
        background: color === 'primary' ? theme.palette.primary.dark : theme.palette.secondary.dark,
      },
      margin: theme.spacing(1),
      padding: theme.spacing(1, 2),
      borderRadius: '8px',
    },
  }));

  const classes = useStyles();

  return (
    <Button onClick={onClick} variant={variant} color={color} type={type} {...props} className={classes.button}>
      {children}
    </Button>
  );
};

export default CommonButton;

