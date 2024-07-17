import { TextField } from '@material-ui/core';

interface textFieldModal {
    japanese: string
    english: string
    setJapanese: (japanese:string) => void
    setEnglish: (english:string) => void
};

const JapaneseAndEnglishTextField: React.FC<textFieldModal> = ({ japanese, english, setJapanese, setEnglish }) => {
    return(
        <>
          <TextField
            variant="outlined"
            fullWidth
            label="日本語"
            margin="dense"
            value={japanese}
            onChange={(e) => { setJapanese(e.target.value) }}
          />

          <TextField
            variant="outlined"
            fullWidth
            label="英語"
            margin="dense"
            value={english}
            onChange={(e) => { setEnglish(e.target.value) }}
          />
        </>
    );
};

export default JapaneseAndEnglishTextField;