import React from "react";

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import { makeStyles } from "@material-ui/core/styles";

import Header from "components/layouts/Header";

const useStyles = makeStyles(() => ({
    container: {
      marginTop: "3rem"
    }
}));

interface CommonLayoutProps {
    children: React.ReactElement
};

const CommonLayout = ({ children }: CommonLayoutProps) => {
    const classes = useStyles();

    return (
        <>
            <header>
                <Header />
            </header>
            <main>
                <Container maxWidth='lg' className={classes.container}>
                    <Grid container justify='center'>
                        <Grid item>
                            {children}
                        </Grid>
                    </Grid>
                </Container>
            </main>
        </>
    );
}

export default CommonLayout;
