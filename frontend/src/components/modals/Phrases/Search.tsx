import React, { useState, useContext, useEffect } from 'react';
import { viewAllTags } from 'lib/api/cradTags';
import { AuthContext } from 'App';
import { Tag, SearchOptions } from 'interfaces';
import { TextField, MenuItem, FormControl, InputLabel, Select, Checkbox, ListItemText, OutlinedInput, Button, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import AlertMessage from 'components/utils/AlertMessage';
import { GreenCheckBox, YellowCheckBox, RedCheckBox, GreyCheckBox } from './CheckState';
import { Box } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
  formControl: {
    margin: theme.spacing(2),
    minWidth: 120,
  },
  checkBoxContainer: {
    display: 'flex',
    gap: theme.spacing(1),
  },
  radioGroup: {
    flexDirection: 'row',
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
    //boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  },
}));

interface recieveProps {
  recieveAllPhrases: (page: number, options: SearchOptions) => Promise<void>
  setRegisterModalIsOpen: (isOpen: boolean) => void
  searchOptions: SearchOptions
  setSearchOptions: (options: SearchOptions) => void
};

const Search: React.FC<recieveProps> = ({ recieveAllPhrases, setRegisterModalIsOpen, searchOptions, setSearchOptions }) => {
  const classes = useStyles();
  const [selectedTags, setSelectedTags] = useState<Tag[]>([{ name: '' }]);
  const [tags, setTags] = useState<Tag[]>([{ name: '' }]);
  const { currentUser } = useContext(AuthContext);
  const [japanese, setJapanese] = useState<string>('');
  const [english, setEnglish] = useState<string>('');
  const [isPartialMatch, setIsPartialMatch] = useState<string>('part');
  const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [changeState1, setChangeState1] = useState<boolean>(false);
  const [changeState2, setChangeState2] = useState<boolean>(false);
  const [changeState3, setChangeState3] = useState<boolean>(false);
  const [changeState4, setChangeState4] = useState<boolean>(false);

  const recieveAllTags = async () => {
    try {
      if (currentUser?.id === undefined) {
        console.log('User ID is undefined');
        return;
      }
      const res = await viewAllTags(currentUser.id);
      console.log(res);
      setTags(res.data.tags);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const {
      target: { value },
    } = event;
    const selectedTagNames = typeof value === 'string' ? value.split(',') : (value as string[]);
    const newSelectedTags = tags.filter(tag => selectedTagNames.includes(tag.name));
    setSelectedTags(newSelectedTags);
  };

  const handleChangeState1 = () => {
    if (!changeState4) {
      setChangeState1(prev => !prev)
    } else {
      return;
    }
  };

  const handleChangeState2 = () => {
    if (!changeState4) {
      setChangeState2(prev => !prev)
    } else {
      return;
    }
  };

  const handleChangeState3 = () => {
    if (!changeState4) {
      setChangeState3(prev => !prev)
    } else {
      return;
    }
  };

  const removeCheckState = () => {
    setChangeState4(prev => !prev);
    setChangeState1(false);
    setChangeState2(false);
    setChangeState3(false);
  };

  useEffect(() => {
    recieveAllTags();
  }, [currentUser]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const updatedSearchOptions: SearchOptions = {
        ...searchOptions,
        japanese: japanese,
        english: english,
        tags: selectedTags,
        isPartialMatch: isPartialMatch === 'part',
        state1: changeState1,
        state2: changeState2,
        state3: changeState3,
        state4: changeState4,
      };
      console.log(updatedSearchOptions);
      setSearchOptions(updatedSearchOptions);
      await recieveAllPhrases(1, updatedSearchOptions);
      setJapanese('');
      setEnglish('');
      setSelectedTags([{ name: '' }]);
      setRegisterModalIsOpen(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setAlertMessage(err.message);
        setAlertMessageOpen(true);
      }
    }
  };

  return (
    <>
      <h1>検索オプション</h1>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth className={classes.formControl}>
          <InputLabel id="selectbox-label">Tags</InputLabel>
          <Select
            labelId="selectbox-label"
            id="selectbox"
            multiple
            value={selectedTags.map(tag => tag.name)}
            onChange={handleChange}
            input={<OutlinedInput label="Tags" />}
            renderValue={(selected) => (selected as string[]).join(', ')}
          >
            {tags.map((tag) => (
              <MenuItem key={tag.id} value={tag.name}>
                <Checkbox checked={selectedTags.some(selectedTag => selectedTag.name === tag.name)} />
                <ListItemText primary={tag.name} />
              </MenuItem>
            ))}
          </Select>

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

          <div className={classes.checkBoxContainer}>
            <GreenCheckBox state={changeState1} isLock={false} toggleState={() => handleChangeState1()} />
            <YellowCheckBox state={changeState2} isLock={false} toggleState={() => handleChangeState2()} />
            <RedCheckBox state={changeState3} isLock={false} toggleState={() => handleChangeState3()} />
            <GreyCheckBox state={changeState4} isLock={false} toggleState={() => removeCheckState()} />
          </div>

          <RadioGroup value={isPartialMatch} onChange={(e) => setIsPartialMatch(e.target.value)} className={classes.radioGroup}>
            <FormControlLabel value="part" control={<Radio />} label="部分一致" />
            <FormControlLabel value="exact" control={<Radio />} label="完全一致" />
          </RadioGroup>

          <Button type="submit" variant="contained" className={classes.button}>
            検索
          </Button>
        </FormControl>
      </form>
      <AlertMessage
        open={alertMessageOpen}
        setOpen={setAlertMessageOpen}
        severity='error'
        message={alertMessage}
      />
    </>
  );
};

export default Search;
