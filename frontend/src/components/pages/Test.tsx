import React, { useState, useContext } from 'react';
import { AuthContext } from 'App';
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';

const useStyles = makeStyles((theme) => ({
    menuButton: {
        position: 'fixed',
        top: theme.spacing(1),
        left: theme.spacing(1),
        zIndex: 1300, // Ensure the button is above other content
    },
}));

const Hambarger: React.FC = () => {

    const { currentUser } = useContext(AuthContext);

    return(
        <>
            <h1>登録ユーザー限定ページ</h1>
            <h2>userID : {currentUser?.id}</h2>
            <h2>email : {currentUser?.email}</h2>
        </>
    )
};

export default Hambarger;
