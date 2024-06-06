import React, { useState, useContext } from 'react';
import { AuthContext } from 'App';
import { Phrase } from 'interfaces';
import { createNewPhrases } from 'lib/api/cradPhrases';

import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';

interface recieveProps {
    recieveAllPhrases: (page: number) => Promise<void>
    currentPage: number
};

const Register: React.FC<recieveProps> = ({recieveAllPhrases, currentPage}) => {
    const { currentUser } = useContext(AuthContext);
    const[japanese, setJapanese] = useState<string>('');
    const[english, setEnglish] = useState<string>('');
    // const [phrases, setPhrases] = useState<Phrase[]>([]);

    const handleSetJapanese = (e: React.ChangeEvent<HTMLInputElement>) => {
        setJapanese(e.target.value);
    };

    const handleSetEnglish = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEnglish(e.target.value);
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
            english: english
        };

        try {
            const res = await createNewPhrases(newPhrase);
            console.log(res);
            await recieveAllPhrases(currentPage);
            setJapanese('');
            setEnglish('');
        } catch(err) {
            console.log(err);
        }

        return;
    };

    return(
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
                    <Button
                    type='submit'
                    variant='contained'
                    size='large'
                    fullWidth
                    color='default'
                    disabled={!japanese || !english ? true : false} // 空欄があった場合はボタンを押せないように
                    onClick={handleCrateNewPhrase}
                    >
                    Submit
                    </Button>
                    <Box textAlign='center'>
                    </Box>
                </CardContent>
                </Card>
            </form>
        </>
    );
};

export default Register;