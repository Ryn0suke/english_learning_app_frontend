import React, { useState, useContext, useEffect } from 'react';
import Modal from 'react-modal';
import { AuthContext } from 'App';
import { Phrase, Tag, SearchOptions } from 'interfaces';
import { updatePhrases, destoyPhrases } from 'lib/api/cradPhrases';
import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';
import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import { GreenCheckBox, YellowCheckBox, RedCheckBox } from './CheckState';
import CommonButton from 'components/ui/Button';
import JapaneseAndEnglishTextField from 'components/ui/JapaneseAndEnglishTextField';
import AddedTagsBox from 'components/ui/AddedTagsBox';
import TagList from 'components/ui/TagList';
import AlertMessage from 'components/utils/AlertMessage';
import { addTag, tagChange } from 'components/utils/TagRelatedFunc';
import { FormControl, InputLabel } from '@material-ui/core';
import { recieveAllTags } from 'components/utils/TagRelatedFunc';

interface ModalProps {
    updateModalIsOpen: boolean
    setUpdateModalIsOpen: (isOpen: boolean) => void
    recieveAllPhrases: (page: number, searchOptions: SearchOptions) => Promise<void>
    currentPage: number
    phrase: Phrase
    searchOptions: SearchOptions
};

const UpdateModal: React.FC<ModalProps> = ({ updateModalIsOpen, setUpdateModalIsOpen, recieveAllPhrases, currentPage, phrase, searchOptions }) => {
    const { currentUser } = useContext(AuthContext);
    const [japanese, setJapanese] = useState<string>('');
    const [english, setEnglish] = useState<string>('');
    const [tags, setTags] = useState<Tag[]>([]);
    const [newTag, setNewTag] = useState<string>('');
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [registeredTag, setRegisteredTag] = useState<Tag[]>([]);
    const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>('');
    const [changeState1, setChangeState1] = useState<boolean>(false);
    const [changeState2, setChangeState2] = useState<boolean>(false);
    const [changeState3, setChangeState3] = useState<boolean>(false);

    useEffect(() => {
        setJapanese(phrase.japanese);
        setEnglish(phrase.english);
        setTags(phrase.tags);
        setChangeState1(phrase.state1);
        setChangeState2(phrase.state2);
        setChangeState3(phrase.state3);
    }, [phrase]);

    useEffect(() => {
        recieveAllTags(currentUser, setRegisteredTag);
    }, [currentUser]);

    const handleDeletePhrase = async (id: number) => {
        try {
            if (currentUser?.id === undefined) {
                console.log('User ID is undefined');
                return;
            }
            const res = await destoyPhrases(id);
            console.log(res);
            await recieveAllPhrases(currentPage, searchOptions);
            setUpdateModalIsOpen(false);
        } catch (err) {
            console.log(err);
        }
    };

    const handleAddTag = () => {
        const newTags = addTag(newTag, tags, selectedTags);
        setTags([...tags, ...newTags]);
        setNewTag('');
        setSelectedTags([]);
    };

    const handleTagChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const selectedTags = tagChange(event, registeredTag);
        setSelectedTags(selectedTags);
    };

    const handleUpdatePhrase = async (phraseID: number, e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (currentUser?.id === undefined) {
            console.log('User ID is undefined');
            return;
        }

        const newPhrase: Phrase = {
            id: currentUser.id,
            japanese: japanese,
            english: english,
            state1: changeState1,
            state2: changeState2,
            state3: changeState3,
            tags: tags
        };

        try {
            const res = await updatePhrases(phraseID, newPhrase);
            console.log(res);
            await recieveAllPhrases(currentPage, searchOptions);
            setJapanese('');
            setEnglish('');
            setTags([]);
            setUpdateModalIsOpen(false);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setAlertMessage(err.message);
                setAlertMessageOpen(true);
            }
        }
    };

    return (
        <Modal isOpen={updateModalIsOpen} onRequestClose={() => setUpdateModalIsOpen(false)}>
            <Box>
                <CommonButton onClick={() => setUpdateModalIsOpen(false)} children={<CloseIcon />} color='secondary'/>
                <CommonButton onClick={() => handleDeletePhrase(phrase.id)} children={<DeleteIcon />}/>
            </Box>

            <h1>更新</h1>
            <form noValidate autoComplete='off'>
                <JapaneseAndEnglishTextField 
                    japanese={japanese}
                    english={english}
                    setJapanese={setJapanese}
                    setEnglish={setEnglish}
                />

                <Box>
                    <GreenCheckBox state={changeState1} isLock={false} toggleState={() => setChangeState1(prev => !prev)} />
                    <YellowCheckBox state={changeState2} isLock={false} toggleState={() => setChangeState2(prev => !prev)} />
                    <RedCheckBox state={changeState3} isLock={false} toggleState={() => setChangeState3(prev => !prev)} />
                </Box>

                <FormControl fullWidth margin='dense' variant='outlined'>
                    <InputLabel>登録されているタグ</InputLabel>
                    <TagList 
                        selectedTags={selectedTags}
                        registeredTag={registeredTag}
                        handleTagChange={handleTagChange}
                    />
                </FormControl>

                <TextField
                    variant='outlined'
                    fullWidth
                    label='新しいタグ'
                    value={newTag}
                    margin='dense'
                    onChange={(e) => setNewTag(e.target.value)}
                />

                <CommonButton onClick={handleAddTag} children='タグを追加'/>

                <AddedTagsBox tags={tags} setTags={setTags}/>

                <CommonButton 
                    onClick={(e) => handleUpdatePhrase(phrase.id, e)}
                    children='更新'
                    type='submit'
                    fullWidth
                    disabled={!japanese || !english || !tags[0]}
                />
                <AlertMessage
                    open={alertMessageOpen}
                    setOpen={setAlertMessageOpen}
                    severity='error'
                    message={alertMessage}
                />
            </form>
        </Modal>
    );
};

export default UpdateModal;
