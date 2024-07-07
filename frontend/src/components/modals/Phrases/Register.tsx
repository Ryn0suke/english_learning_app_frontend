import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from 'App';
import { Phrase, SearchOptions } from 'interfaces';
import { createNewPhrases } from 'lib/api/cradPhrases';
import AlertMessage from 'components/utils/AlertMessage';
import { Tag } from 'interfaces';
import { viewAllTags } from 'lib/api/cradTags';

import { TextField, MenuItem, FormControl, InputLabel, Select, Checkbox, ListItemText, OutlinedInput, Button } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { makeStyles, Theme } from '@material-ui/core/styles';

import validate from 'components/utils/Validation';

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

interface recieveProps {
    recieveAllPhrases: (page: number, options: SearchOptions) => Promise<void>
    currentPage: number
    searchOptions: SearchOptions
};

const Register: React.FC<recieveProps> = ({ recieveAllPhrases, currentPage, searchOptions }) => {
    const { currentUser } = useContext(AuthContext);
    const [japanese, setJapanese] = useState<string>('');
    const [english, setEnglish] = useState<string>('');
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [newTag, setNewTag] = useState<string>('');
    const [registeredTag, setRegisteredTag] = useState<Tag[]>([]);
    const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>('');
    const classes = useStyles();

    const recieveAllTags = async () => {
        try {
            if (currentUser?.id === undefined) {
                console.log('User ID is undefined');
                return;
            }
            const res = await viewAllTags(currentUser.id);
            console.log(res);
            setRegisteredTag(res.data.tags);
        } catch (err) {
            console.log(err);
        }
    };

    const handleSetNewTag = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewTag(e.target.value);
    };

    const handleAddTag = () => {
        const newTags: Tag[] = [];
    
        // 新しいタグを追加
        if (newTag && !tags.map(tag => tag.name).includes(newTag)) {
            newTags.push({ name: newTag });
        }
    
        // 選択された登録済みタグを追加
        selectedTags.forEach(tag => {
            if (!tags.map(t => t.name).includes(tag.name)) {
                newTags.push(tag);
            }
        });
    
        setTags([...tags, ...newTags]);
        setNewTag('');
        setSelectedTags([]);
    };

    const handleDeleteTag = (index: number) => {
        const updatedTags = tags.filter((_, i) => i !== index);
        setTags(updatedTags);
    };

    const handleTagChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const selectedTagNames = event.target.value as string[];
        const selectedTags = registeredTag.filter(tag => selectedTagNames.includes(tag.name));
        setSelectedTags(selectedTags);
    };

    const handleCreateNewPhrase = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if(validate(japanese) || validate(english)) {
            window.alert("文字数は50文字までです");
            return;
        }

        if (currentUser?.id === undefined) {
            console.log('User ID is undefined');
            return;
        }

        const newPhrase: Phrase = {
            id: currentUser.id,
            japanese: japanese,
            english: english,
            state1: false,
            state2: false,
            state3: false,
            tags: tags // タグを追加
        };

        try {
            const res = await createNewPhrases(newPhrase);
            console.log(res);
            await recieveAllPhrases(currentPage, searchOptions);
            setJapanese('');
            setEnglish('');
            setTags([]);
            setSelectedTags([]);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setAlertMessage(err.message);
                setAlertMessageOpen(true);
            }
        }
    };

    useEffect(() => {
        recieveAllTags();
    }, [currentUser]);

    return (
        <>
            <form noValidate autoComplete='off'>
                <h1>登録</h1>
                <TextField
                    variant='outlined'
                    required
                    fullWidth
                    label='日本語'
                    value={japanese}
                    margin='dense'
                    onChange={(e) => {setJapanese(e.target.value)}}
                />
                <TextField
                    variant='outlined'
                    required
                    fullWidth
                    label='英語'
                    value={english}
                    margin='dense'
                    onChange={(e) => {setEnglish(e.target.value)}}
                />
                <FormControl fullWidth margin='dense' variant='outlined'>
                    <InputLabel>登録されているタグ</InputLabel>
                    <Select
                        label="登録されているタグ"
                        multiple
                        value={selectedTags.map(tag => tag.name)}
                        onChange={handleTagChange}
                        input={<OutlinedInput label="登録されているタグ" />}
                        renderValue={(selected) => (selected as string[]).join(', ')}
                    >
                        {registeredTag.map((tag) => (
                            <MenuItem key={tag.id} value={tag.name}>
                                <Checkbox checked={selectedTags.some(selectedTag => selectedTag.name === tag.name)} />
                                <ListItemText primary={tag.name} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
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
                    disabled={!japanese || !english || tags.length === 0}
                    onClick={handleCreateNewPhrase}
                >
                    登録
                </Button>
                <AlertMessage
                    open={alertMessageOpen}
                    setOpen={setAlertMessageOpen}
                    severity='error'
                    message={alertMessage}
                />
            </form>
        </>
    );
};

export default Register;





// Register.tsx
// import React, { useState, useContext } from 'react';
// import PhraseForm from './commonPart';
// import { AuthContext } from 'App';
// import { Phrase } from 'interfaces';
// import { createNewPhrases } from 'lib/api/cradPhrases';
// import AlertMessage from 'components/utils/AlertMessage';

// interface recieveProps {
//   recieveAllPhrases: (page: number) => Promise<void>;
//   currentPage: number;
// }

// const Register: React.FC<recieveProps> = ({ recieveAllPhrases, currentPage }) => {
//   const { currentUser } = useContext(AuthContext);
//   const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false);
//   const [alertMessage, setAlertMessage] = useState<string>('');

//   const handleCreateNewPhrase = async (id: number, newPhrase: Phrase) => {
//     try {
//       const res = await createNewPhrases(id, newPhrase);
//       console.log(res);
//       await recieveAllPhrases(currentPage);
//     } catch (err: unknown) {
//       if (err instanceof Error) {
//         setAlertMessage(err.message);
//         setAlertMessageOpen(true);
//       }
//     }
//   };

//   return (
//     <>
//       <PhraseForm
//         initialJapanese=''
//         initialEnglish=''
//         initialTags={[]}
//         onSubmit={handleCreateNewPhrase}
//         submitLabel='登録'
//       />
//       <AlertMessage
//         open={alertMessageOpen}
//         setOpen={setAlertMessageOpen}
//         severity='error'
//         message={alertMessage}
//       />
//     </>
//   );
// };

// export default Register;
