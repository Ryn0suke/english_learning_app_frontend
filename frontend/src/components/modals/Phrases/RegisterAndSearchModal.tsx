import Modal from 'react-modal';
import Button from '@material-ui/core/Button';
import React, { useState } from 'react';
import Register from './Register';
import Search from './Search';
import { SearchOptions } from 'interfaces';

import CloseIcon from '@material-ui/icons/Close';
import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
    modalContent: {
        width: '80%',
        backgroundColor: theme.palette.background.paper,
    },

    button: {
        background: theme.palette.primary.main,
        color: 'white',
        '&:hover': {
            background: theme.palette.primary.dark,
        },
        margin: theme.spacing(1),
        padding: theme.spacing(1, 2),
        borderRadius: '8px',
    },
    closeButton: {
        background: theme.palette.secondary.main,
        color: 'white',
        '&:hover': {
            background: theme.palette.secondary.dark,
        },
        margin: theme.spacing(1),
        padding: theme.spacing(1, 2),
        borderRadius: '8px',
    },
}));

interface ModalProps {
    registerModalIsOpen: boolean
    setRegisterModalIsOpen: (isOpen: boolean) => void
    recieveAllPhrases: (page: number, options: SearchOptions) => Promise<void>
    currentPage: number
    searchOptions: SearchOptions
    setSearchOptions: (options: SearchOptions) => void
};

const RegisterAndSearchModal: React.FC<ModalProps> = ({ registerModalIsOpen, setRegisterModalIsOpen, recieveAllPhrases, currentPage, searchOptions, setSearchOptions }) => {
    const [isRegisterMode, setIsResigterMode] = useState<boolean>(true);
    const classes = useStyles();

    return (
        <Modal isOpen={registerModalIsOpen} onRequestClose={() => setRegisterModalIsOpen(false)} ariaHideApp={false}>
            <div>
                <Button onClick={() => setRegisterModalIsOpen(false)} className={classes.closeButton}>
                    <CloseIcon />
                </Button>
                <Button onClick={() => setIsResigterMode(true)} className={classes.button}>登録</Button>
                <Button onClick={() => setIsResigterMode(false)} className={classes.button}>検索</Button>
            
                {isRegisterMode ? (
                    <Register recieveAllPhrases={recieveAllPhrases} currentPage={currentPage} searchOptions={searchOptions} />
                ) : (
                    <Search recieveAllPhrases={recieveAllPhrases} setRegisterModalIsOpen={setRegisterModalIsOpen} searchOptions={searchOptions} setSearchOptions={setSearchOptions} />
                )}
            </div>
        </Modal>
    );
};

export default RegisterAndSearchModal;
