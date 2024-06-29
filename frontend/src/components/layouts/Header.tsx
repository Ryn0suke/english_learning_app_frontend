import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';

import { makeStyles, Theme } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';

import { signOut } from 'lib/api/auth';
import { AuthContext } from 'App';

const useStyles = makeStyles((theme: Theme) => ({
    menuButton: {
        position: 'fixed',
        top: theme.spacing(1),
        left: theme.spacing(1),
        zIndex: 1300,
        width: '60px',
        height: '60px',
    },
    linkBtn: {
        textTransform: 'none'
    },
    menuIcon: {
        fontSize: '2.5rem',
    }
}));

const Header: React.FC = () => {
    const { loading, isSignedIn, setIsSignedIn } = useContext(AuthContext);
    const classes = useStyles();
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
    const navigate = useNavigate();

    const toggleDrawer = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (event.type === 'keydown' && ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const handleSignOut = async () => {
        try {
            const res = await signOut();

            if (res.data.success === true) {
                Cookies.remove('_access_token');
                Cookies.remove('_client');
                Cookies.remove('_uid');

                setIsSignedIn(false);
                navigate('/signin');
                console.log('サインアウト成功');
            } else {
                console.log('サインアウト失敗');
            }
        } catch (err) {
            console.log(err);
        }
    };

    const drawerList = (
        <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <List>
                {!loading && (
                    <>
                        {isSignedIn ? (
                            <>
                                <ListItem button component={Link} to="/">
                                    {/* <HomeIcon /> */}
                                    <ListItemText primary="Home" />
                                </ListItem>
                                <ListItem button component={Link} to="/phrases">
                                    <ListItemText primary="Phrases" />
                                </ListItem>
                                <ListItem button component={Link} to="/test">
                                    <ListItemText primary="Test" />
                                </ListItem>  
                                <ListItem button onClick={() => handleSignOut()}>
                                    {/* <ExitToAppIcon /> */}
                                    <ListItemText primary="Sign out" />
                                </ListItem>          
                            </>
                        ) : (
                            <>
                                <ListItem button component={Link} to="/">
                                    <ListItemText primary="Home" />
                                </ListItem>
                                <Divider />
                                <ListItem button component={Link} to="/signin">
                                    {/* <LockOpenIcon /> */}
                                    <ListItemText primary="Sign in" />
                                </ListItem>
                                <ListItem button component={Link} to="/signup">
                                    <ListItemText primary="Sign up" />
                                </ListItem>
                            </>
                        )}
                    </>
                )}
            </List>
        </Box>
    );

    return (
        <div>
            <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={toggleDrawer(true)}
                className={classes.menuButton}
            >
                <MenuIcon className={classes.menuIcon} />
            </IconButton>
            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
                {drawerList}
            </Drawer>
        </div>
    );
};

export default Header;
