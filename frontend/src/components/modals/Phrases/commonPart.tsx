import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from 'App';
import { Phrase, Tag } from 'interfaces';
import { TextField, Card, CardContent, CardHeader, Button, Box } from '@material-ui/core';
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

interface PhraseFormProps {
  initialJapanese: string;
  initialEnglish: string;
  initialTags: Tag[];
  onSubmit: (phrase: Phrase) => Promise<void>;
  submitLabel: string;
}

const PhraseForm: React.FC<PhraseFormProps> = ({
  initialJapanese,
  initialEnglish,
  initialTags,
  onSubmit,
  submitLabel,
}) => {
  const { currentUser } = useContext(AuthContext);
  const [japanese, setJapanese] = useState<string>(initialJapanese);
  const [english, setEnglish] = useState<string>(initialEnglish);
  const [tags, setTags] = useState<Tag[]>(initialTags);
  const [newTag, setNewTag] = useState<string>('');
  const classes = useStyles();

  useEffect(() => {
    setJapanese(initialJapanese);
    setEnglish(initialEnglish);
    setTags(initialTags);
  }, [initialJapanese, initialEnglish, initialTags]);

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

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (currentUser?.id === undefined) {
      console.log('User ID is undefined');
      return;
    }

    const newPhrase: Phrase = {
      id: currentUser.id,
      japanese: japanese,
      english: english,
      tags: tags,
    };

    await onSubmit(newPhrase);
    setJapanese('');
    setEnglish('');
    setTags([]);
  };

  return (
    <form noValidate autoComplete="off">
      <Card>
        <CardHeader title={submitLabel} />
        <CardContent>
          <TextField
            variant="outlined"
            required
            fullWidth
            label="日本語"
            value={japanese}
            margin="dense"
            onChange={handleSetJapanese}
          />
          <TextField
            variant="outlined"
            required
            fullWidth
            label="英語"
            value={english}
            margin="dense"
            onChange={handleSetEnglish}
          />
          <TextField
            variant="outlined"
            fullWidth
            label="新しいタグ"
            value={newTag}
            margin="dense"
            onChange={handleSetNewTag}
          />
          <Button
            variant="contained"
            size="small"
            color="default"
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
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            color="default"
            disabled={!japanese || !english || !tags[0]}
            onClick={handleSubmit}
          >
            {submitLabel}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
};

export default PhraseForm;
