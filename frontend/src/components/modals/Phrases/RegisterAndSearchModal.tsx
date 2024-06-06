import Modal from 'react-modal';
import Button from '@material-ui/core/Button';
import React, { useState } from 'react';
import Register from './Register';
import Search from './Search';

import CloseIcon from '@material-ui/icons/Close';

interface ModalProps {
    modalIsOpen: boolean
    setModalIsOpen: (isOpen: boolean) => void
    recieveAllPhrases: (page: number) => Promise<void>
    currentPage: number
};

const RegisterAndSearchModal: React.FC<ModalProps> = ({ modalIsOpen, setModalIsOpen, recieveAllPhrases, currentPage }) => {
    const [isRegisterMode, setIsResigterMode] = useState<boolean>(true);

    return(
        <>
            <Modal isOpen={modalIsOpen} >
                <Button onClick={() => setModalIsOpen(false)}>
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