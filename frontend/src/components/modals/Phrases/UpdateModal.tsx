import React, { useState, useEffect, useContext } from 'react';
import Modal from 'react-modal';
import Button from '@material-ui/core/Button';
import Register from './Register';
import Search from './Search';
import { AuthContext } from 'App';
import { Phrase } from 'interfaces';
import { Tag } from 'interfaces';

import { viewAllPhrases, createNewPhrases, updatePhrases, destoyPhrases } from 'lib/api/cradPhrases';

import CloseIcon from '@material-ui/icons/Close';
import DeleteIcon from '@material-ui/icons/Delete';

import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles, Theme } from '@material-ui/core/styles';

interface ModalProps {
    updateModalIsOpen: boolean
    setUpdateModalIsOpen: (isOpen: boolean) => void
    recieveAllPhrases: (page: number) => Promise<void>
    currentPage: number
    phrase: Phrase
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
}));

const UpdateModal:React.FC<ModalProps> = ({ updateModalIsOpen, setUpdateModalIsOpen, recieveAllPhrases, currentPage, phrase }) => {
    const { currentUser } = useContext(AuthContext);
    const [japanese, setJapanese] = useState<string>('');
    const [english, setEnglish] = useState<string>('');
    const [tags, setTags] = useState<Tag[]>([]);
    const [newTag, setNewTag] = useState<string>('');
    const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>('');
    const classes = useStyles();

    useEffect(() => {
        setJapanese(phrase.japanese);
        setEnglish(phrase.english);
        setTags(phrase.tags);
    }, [phrase]);

    const handleDeletePhrase = async (id: number) => {
        try {
            if (currentUser?.id === undefined) {
                console.log('User ID is undefined');
                return;
            }
            const res = await destoyPhrases(id);
            console.log(res);
            await recieveAllPhrases(currentPage);
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

    const handleUpdatePhrase = async(phraseID: number, e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (currentUser?.id === undefined) {
            console.log('User ID is undefined');
            return;
        }

        const newPhrase: Phrase = {
            id: currentUser.id,
            japanese: japanese,
            english: english,
            tags: tags // タグを追加
        };

        try {
            const res = await updatePhrases(phraseID, newPhrase);
            console.log(res);
            await recieveAllPhrases(currentPage);
            setJapanese('');
            setEnglish('');
            setTags([]);
            setUpdateModalIsOpen(false);
        } catch(err: unknown) {
            if(err instanceof Error) {
                setAlertMessage(err.message);
                setAlertMessageOpen(true);
            }
        }
    };

    return (
        <>
            <Modal isOpen={updateModalIsOpen}>
                <Button onClick={() => setUpdateModalIsOpen(false)}>
                    <CloseIcon />
                </Button>

                <Button onClick={() => handleDeletePhrase(phrase.id)}>
                    <DeleteIcon />
                </Button>

                <form noValidate autoComplete='off'>
                    <Card>
                        <CardHeader title='フレーズの更新' />
                        <CardContent>
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
                                color='default'
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
                                color='default'
                                disabled={!japanese || !english || !tags[0]}
                                onClick={(e) => handleUpdatePhrase(phrase.id, e)}
                            >
                                Submit
                            </Button>
                            <Box textAlign='center'></Box>
                        </CardContent>
                    </Card>
                </form>
            </Modal>
        </>
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
