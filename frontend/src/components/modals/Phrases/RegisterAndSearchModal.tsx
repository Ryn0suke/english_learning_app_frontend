import Modal from 'react-modal';
import Button from '@material-ui/core/Button';
import React, { useState } from 'react';
import Register from './Register';
import Search from './Search';

import CloseIcon from '@material-ui/icons/Close';

interface ModalProps {
    registerModalIsOpen: boolean
    setRegisterModalIsOpen: (isOpen: boolean) => void
    recieveAllPhrases: (page: number) => Promise<void>
    currentPage: number
};

const RegisterAndSearchModal: React.FC<ModalProps> = ({ registerModalIsOpen, setRegisterModalIsOpen, recieveAllPhrases, currentPage }) => {
    const [isRegisterMode, setIsResigterMode] = useState<boolean>(true);

    return(
        <>
            <Modal isOpen={registerModalIsOpen} >
                <Button onClick={() => setRegisterModalIsOpen(false)}>
                    <CloseIcon />
                </Button>
                <Button onClick={() => setIsResigterMode(true)}>登録</Button>
                <Button onClick={() => setIsResigterMode(false)}>検索</Button>
            
                {isRegisterMode ? <Register recieveAllPhrases={recieveAllPhrases} currentPage={currentPage}/> : <Search />}
            </Modal>
        </>
    );
};

export default RegisterAndSearchModal;