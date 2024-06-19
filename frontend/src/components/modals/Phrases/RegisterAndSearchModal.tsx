import Modal from 'react-modal';
import Button from '@material-ui/core/Button';
import React, { useState } from 'react';
import Register from './Register';
import Search from './Search';
import { SearchOptions } from 'interfaces';

import CloseIcon from '@material-ui/icons/Close';

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

    return(
        <>
            <Modal isOpen={registerModalIsOpen} >
                <Button onClick={() => setRegisterModalIsOpen(false)}>
                    <CloseIcon />
                </Button>
                <Button onClick={() => setIsResigterMode(true)}>登録</Button>
                <Button onClick={() => setIsResigterMode(false)}>検索</Button>
            
                {isRegisterMode ? <Register recieveAllPhrases={recieveAllPhrases} currentPage={currentPage} searchOptions={searchOptions}/> 
                : <Search recieveAllPhrases={recieveAllPhrases} setRegisterModalIsOpen={setRegisterModalIsOpen} searchOptions={searchOptions} setSearchOptions={setSearchOptions}/>}
            </Modal>
        </>
    );
};

export default RegisterAndSearchModal;