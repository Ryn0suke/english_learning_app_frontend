import { useState, useContext, useEffect } from 'react';
import Modal from 'react-modal';
import { Card, CardContent, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { TextField, MenuItem, FormControl, InputLabel, Select, Checkbox, ListItemText, OutlinedInput, Button, RadioGroup, FormControlLabel, Radio } from '@material-ui/core';
import { GreenCheckBox, YellowCheckBox, RedCheckBox } from '../Phrases/CheckState';
import { viewAllTags } from 'lib/api/cradTags';
import { AuthContext } from 'App';
import { Tag, QuestionOptions, Phrase } from 'interfaces';
import NumberInput from 'components/ui/NumberInput';
import { searchQuestion } from 'lib/api/cradPhrases';


interface ModalProps {
    modalIsOpen: boolean
    setModalIsOpen: (isOpen: boolean) => void
    numOfQuestions: number
    setNumOfQuestions: (qNum: number) => void
    setPhrases: (phrases: Phrase[]) => void
    isJapaneseToEnglish: string
    setIsJapaneseToEnglish: (japaneseToEnglish: string) => void
    currentPage: number
    setCurrentQuestion: (currentQuestion: number) => void
};

const SettingModal: React.FC<ModalProps> = ({ modalIsOpen, setModalIsOpen, numOfQuestions, setNumOfQuestions, setPhrases, isJapaneseToEnglish, setIsJapaneseToEnglish, currentPage, setCurrentQuestion }) => {
    const [selectedTags, setSelectedTags] = useState<Tag[]>([{name: ''}]);
    const [changeState1, setChangeState1] = useState<boolean>(false);
    const [changeState2, setChangeState2] = useState<boolean>(false);
    const [changeState3, setChangeState3] = useState<boolean>(false);
    const [tags, setTags] = useState<Tag[]>([{name: ''}]);
    const { currentUser } = useContext(AuthContext);
    const [questionOptions, setQuestionOptions] = useState<QuestionOptions>({tags:[{name: ''}], numOfQuestions: 0, page: 1, isJapaneseToEnglish: true});

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

      const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        console.log(selectedTags);
        event.preventDefault();
        try {
          const newQuestionOptions: QuestionOptions = {
            tags: selectedTags,
            state1: changeState1,
            state2: changeState2,
            state3: changeState3,
            numOfQuestions: numOfQuestions,
            page: currentPage,
            isJapaneseToEnglish: isJapaneseToEnglish === 'japaneseToEnglish' ? true : false
          };
      
          if (currentUser?.id === undefined) {
            console.log('User ID is undefined');
            return;
          };
      
          console.log(newQuestionOptions);
          const res = await searchQuestion(currentUser.id, newQuestionOptions);
          console.log(res);
          setPhrases(res.data.phrases);
          setNumOfQuestions(res.data.phrases.length);
          setSelectedTags([{name: ''}]);
          setChangeState1(false);
          setChangeState2(false);
          setChangeState3(false);
          setQuestionOptions({tags:[{name: ''}], numOfQuestions: 0, page: 1, isJapaneseToEnglish: true});
          setCurrentQuestion(0);
          setModalIsOpen(false);
        } catch (err) {
          console.log(err);
        }
      };
      

      useEffect(() => {
        // setPhrases([]);
        recieveAllTags();
      }, [currentUser]);

    return(
        <Modal isOpen={modalIsOpen}>
            <Button onClick={() => {setModalIsOpen(false)}}>
                <CloseIcon />
            </Button>

            <h1>出題オプション</h1>
            
            <form onSubmit={handleSubmit}>
                <FormControl fullWidth>
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


                <div style={ {display: 'flex'} }>
                    <h3>チェック状態</h3>
                    <GreenCheckBox state={changeState1} isLock={false} toggleState={() => {
                                        setChangeState1(prev => !prev)}}/>
                    <YellowCheckBox state={changeState2} isLock={false} toggleState={() => {
                                        setChangeState2(prev => !prev)}}/>
                    <RedCheckBox state={changeState3} isLock={false} toggleState={() => {
                                        setChangeState3(prev => !prev)}}/>
                </div>

                <h3>問題数</h3>

                <div>
                  <NumberInput value={numOfQuestions} setValue={setNumOfQuestions}/>
                </div>

                <RadioGroup value={isJapaneseToEnglish} onChange={(e) => setIsJapaneseToEnglish(e.target.value)}>
                  <FormControlLabel value="japaneseToEnglish" control={<Radio />} label="日本語→英語" />
                  <FormControlLabel value="englishToJapanese" control={<Radio />} label="英語→日本語" />
                </RadioGroup>
                

                <Button type="submit" variant="contained" color="primary">
                    出題開始
                </Button>
                </FormControl>
            </form>
        </Modal>
    )
}

export default SettingModal;