import React, { useState, useEffect, useContext } from 'react';
import Modal from 'react-modal';
import Button from '@material-ui/core/Button';
import { AuthContext } from 'App';
import { Phrase, Tag, SearchOptions } from 'interfaces';

import { viewAllPhrases, updatePhrases, destoyPhrases } from 'lib/api/cradPhrases';

import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';

import TextField from '@material-ui/core/TextField';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { GreenCheckBox, YellowCheckBox, RedCheckBox } from './CheckState';

interface ModalProps {
    updateModalIsOpen: boolean
    setUpdateModalIsOpen: (isOpen: boolean) => void
    recieveAllPhrases: (page: number, searchOptions: SearchOptions) => Promise<void>
    currentPage: number
    phrase: Phrase
    searchOptions: SearchOptions
};

const useStyles = makeStyles((theme: Theme) => ({
    tagBox: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: theme.spacing(1),
        marginTop: theme.spacing(2),
        margin: theme.spacing(2),
    },
    tag: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0.5, 1),
        backgroundColor: theme.palette.grey[300],
        borderRadius: theme.shape.borderRadius,
    },
    deleteTagButton: {
        marginLeft: theme.spacing(1),
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

    submitButton: {
        background: theme.palette.primary.main,
        color: 'white',
        '&:hover': {
            background: theme.palette.primary.dark,
        },
        margin: theme.spacing(1),
        padding: theme.spacing(1, 2),
        borderRadius: '8px',
    },
}));

//theme.palette.secondary.main

const UpdateModal: React.FC<ModalProps> = ({ updateModalIsOpen, setUpdateModalIsOpen, recieveAllPhrases, currentPage, phrase, searchOptions }) => {
    const { currentUser } = useContext(AuthContext);
    const [japanese, setJapanese] = useState<string>('');
    const [english, setEnglish] = useState<string>('');
    const [tags, setTags] = useState<Tag[]>([]);
    const [newTag, setNewTag] = useState<string>('');
    const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>('');
    const classes = useStyles();
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

    const handleSetNewTag = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewTag(e.target.value);
    };

    const handleAddTag = () => {
        if (newTag && !tags.map(tag => tag.name).includes(newTag)) {
            const newTagObj: Tag = { name: newTag };
            setTags([...tags, newTagObj]);
            setNewTag('');
            console.log(newTag);
        }
    };

    const handleDeleteTag = (index: number) => {
        const updatedTags = tags.filter((_, i) => i !== index);
        setTags(updatedTags);
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
            tags: tags // タグを追加
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
                <Button onClick={() => setUpdateModalIsOpen(false)} className={classes.closeButton}>
                    <CloseIcon />
                </Button>
                <Button onClick={() => handleDeletePhrase(phrase.id)} className={classes.button}>
                    <DeleteIcon />
                </Button>
            </Box>

            <h1>更新</h1>
            <form noValidate autoComplete='off'>
                <TextField
                    variant='outlined'
                    required
                    fullWidth
                    label='日本語'
                    value={japanese}
                    margin='dense'
                    onChange={(e) => setJapanese(e.target.value)}
                />
                <TextField
                    variant='outlined'
                    required
                    fullWidth
                    label='英語'
                    value={english}
                    margin='dense'
                    onChange={(e) => setEnglish(e.target.value)}
                />

                <Box>
                    <GreenCheckBox state={changeState1} isLock={false} toggleState={() => {
                        setChangeState1(prev => !prev)
                    }} />
                    <YellowCheckBox state={changeState2} isLock={false} toggleState={() => {
                        setChangeState2(prev => !prev)
                    }} />
                    <RedCheckBox state={changeState3} isLock={false} toggleState={() => {
                        setChangeState3(prev => !prev)
                    }} />
                </Box>

                <TextField
                    variant='outlined'
                    fullWidth
                    label='新しいタグ'
                    value={newTag}
                    margin='dense'
                    onChange={handleSetNewTag}
                />
                <Button
                    variant='contained'
                    size='small'
                    className={classes.button}
                    onClick={handleAddTag}
                >
                    Add Tag
                </Button>
                <Box className={classes.tagBox}>
                    {tags.map((tag, index) => (
                        <div key={index} className={classes.tag}>
                            {tag.name}
                            <IconButton
                                size='small'
                                className={classes.deleteTagButton}
                                onClick={() => handleDeleteTag(index)}
                            >
                                <DeleteIcon fontSize='small' />
                            </IconButton>
                        </div>
                    ))}
                </Box>
                <Button
                    type='submit'
                    variant='contained'
                    size='large'
                    fullWidth
                    className={classes.submitButton}
                    disabled={!japanese || !english || !tags[0]}
                    onClick={(e) => handleUpdatePhrase(phrase.id, e)}
                >
                    更新
                </Button>
            </form>
        </Modal>
    );
};

export default UpdateModal;





// UpdateModal.tsx
// import React, { useState, useContext } from 'react';
// import Modal from 'react-modal';
// import Button from '@material-ui/core/Button';
// import CloseIcon from '@material-ui/icons/Close';
// import DeleteIcon from '@material-ui/icons/Delete';
// import PhraseForm from './commonPart';
// import { AuthContext } from 'App';
// import { Phrase } from 'interfaces';
// import { destoyPhrases } from 'lib/api/cradPhrases';
// import { updatePhrases } from 'lib/api/cradPhrases';
// import AlertMessage from 'components/utils/AlertMessage';

// interface ModalProps {
//   updateModalIsOpen: boolean;
//   setUpdateModalIsOpen: (isOpen: boolean) => void;
//   recieveAllPhrases: (page: number) => Promise<void>;
//   currentPage: number;
//   phrase: Phrase;
// }

// const UpdateModal: React.FC<ModalProps> = ({ updateModalIsOpen, setUpdateModalIsOpen, recieveAllPhrases, currentPage, phrase }) => {
//   const { currentUser } = useContext(AuthContext);
//   const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false);
//   const [alertMessage, setAlertMessage] = useState<string>('');

//   const handleDeletePhrase = async (id: number) => {
//     try {
//       if (currentUser?.id === undefined) {
//         console.log('User ID is undefined');
//         return;
//       }
//       const res = await destoyPhrases(id);
//       console.log(res);
//       await recieveAllPhrases(currentPage);
//       setUpdateModalIsOpen(false);
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const handleUpdatePhrase = async (id:number, updatedPhrase: Phrase) => {
//     console.log(updatedPhrase);
//     try {
//         const res = await updatePhrases(id, updatedPhrase);
//         console.log(res);
//         await recieveAllPhrases(currentPage);
//       } catch (err: unknown) {
//         if (err instanceof Error) {
//           setAlertMessage(err.message);
//           setAlertMessageOpen(true);
//         }
//       }
//   };

//   return (
//     <>
//       <Modal isOpen={updateModalIsOpen}>
//         <Button onClick={() => setUpdateModalIsOpen(false)}>
//           <CloseIcon />
//         </Button>
//         <Button onClick={() => handleDeletePhrase(phrase.id)}>
//           <DeleteIcon />
//         </Button>
//         <PhraseForm
//           initialJapanese={phrase.japanese}
//           initialEnglish={phrase.english}
//           initialTags={phrase.tags}
//           onSubmit={handleUpdatePhrase}
//           submitLabel='更新'
//         />
//       </Modal>
//     </>
//   );
// };

// export default UpdateModal;
