import React, { useState, useContext } from 'react';
import { AuthContext } from 'App';
import { Phrase } from 'interfaces';
import { createNewPhrases } from 'lib/api/cradPhrases';
import AlertMessage from 'components/utils/AlertMessage';
import { Tag } from 'interfaces';

import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
    tagBox: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: theme.spacing(1),
        marginTop: theme.spacing(2),
        margin: theme.spacing(2),
      },
      tag: {
        padding: theme.spacing(0.5, 1),
        backgroundColor: theme.palette.grey[300],
        borderRadius: theme.shape.borderRadius,
      },
  }));

interface recieveProps {
    recieveAllPhrases: (page: number) => Promise<void>
    currentPage: number
};

const Register: React.FC<recieveProps> = ({ recieveAllPhrases, currentPage }) => {
    const { currentUser } = useContext(AuthContext);
    const [japanese, setJapanese] = useState<string>('');
    const [english, setEnglish] = useState<string>('');
    const [tags, setTags] = useState<Tag[]>([]);
    const [newTag, setNewTag] = useState<string>('');
    const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false);
    const [alertMessage, setAlertMessage] = useState<string>('');
    const classes = useStyles();

    const handleSetJapanese = (e: React.ChangeEvent<HTMLInputElement>) => {
        setJapanese(e.target.value);
    };

    const handleSetEnglish = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEnglish(e.target.value);
    };

    const handleSetNewTag = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewTag(e.target.value);
    };

    const handleAddTag = () => {
        if (newTag && !tags.map(tag => tag.name).includes(newTag)) {
            const newTagObj: Tag = { name: newTag };
            setTags([...tags, newTagObj]);
            setNewTag('');
        }
    };

    const handleCrateNewPhrase = async(e: React.MouseEvent<HTMLButtonElement>) => {
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
            const res = await createNewPhrases(newPhrase);
            console.log(res);
            await recieveAllPhrases(currentPage);
            setJapanese('');
            setEnglish('');
            setTags([]);
        } catch(err: unknown) {
            if(err instanceof Error) {
                setAlertMessage(err.message);
                setAlertMessageOpen(true);
            }

        }

        return;
    };

    return (
        <>
            <form noValidate autoComplete='off'>
                <Card>
                    <CardHeader title='フレーズの登録' />
                    <CardContent>
                        <TextField
                            variant='outlined'
                            required
                            fullWidth
                            label='日本語'
                            value={japanese}
                            margin='dense'
                            onChange={handleSetJapanese}
                        />
                        <TextField
                            variant='outlined'
                            required
                            fullWidth
                            label='英語'
                            value={english}
                            margin='dense'
                            onChange={handleSetEnglish}
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
                                <span key={index} className={classes.tag}>{tag.name}</span>
                            ))}
                        </Box>
                        <Button
                            type='submit'
                            variant='contained'
                            size='large'
                            fullWidth
                            color='default'
                            disabled={!japanese || !english}
                            onClick={handleCrateNewPhrase}
                        >
                            Submit
                        </Button>
                        <Box textAlign='center'></Box>
                    </CardContent>
                    <AlertMessage
                        open={alertMessageOpen}
                        setOpen={setAlertMessageOpen}
                        severity='error'
                        message={alertMessage}
                    />
                </Card>
            </form>
        </>
    );
};

export default Register;
