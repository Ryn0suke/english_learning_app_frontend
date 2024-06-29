import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from 'App';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { Typography } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { Phrase } from 'interfaces';
import SettingModal from 'components/modals/Test/SettingModal';
import { GreenCheckBox, YellowCheckBox, RedCheckBox } from 'components/modals/Phrases/CheckState';
import { updatePhrases, searchQuestion } from 'lib/api/cradPhrases';
import Question from 'components/modals/Test/Question';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 975,
    minHeight: 500,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  question: {
    minWidth: 500,
    minHeight: 300,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxButtonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: '0 16px',
  },
  checkboxContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  checkbox: {
    marginRight: 8,
  },
  answerButtonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    paddingRight: 30,
  },
});

const Hambarger: React.FC = () => {
  const { currentUser } = useContext(AuthContext);
  const classes = useStyles();
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
  const bull = <span className={classes.bullet}>•</span>;
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [numOfQuestions, setNumOfQuestions] = useState<number>(0);
  const [changeState1, setChangeState1] = useState<boolean>(false);
  const [changeState2, setChangeState2] = useState<boolean>(false);
  const [changeState3, setChangeState3] = useState<boolean>(false);
  const [isJapaneseToEnglish, setIsJapaneseToEnglish] = useState<string>('japaneseToEnglish');
  const [isAnswer, setIsAnswer] = useState<boolean>(false);

  const handleNextQuestion = async () => {
    try {
      const updatedPhrase: Phrase = {
        ...phrases[currentQuestion],
        state1: changeState1,
        state2: changeState2,
        state3: changeState3,
      }
      const res = await updatePhrases(updatedPhrase.id, updatedPhrase);
      setCurrentQuestion((prev: number) => prev + 1);
    } catch (err) {
      console.log(err);
    };
  };

  const handleNextPage = async () => {
    // Implementation for handling next page
  };

  useEffect(() => {
    if (phrases[currentQuestion]) {
      setChangeState1(phrases[currentQuestion].state1);
      setChangeState2(phrases[currentQuestion].state2);
      setChangeState3(phrases[currentQuestion].state3);
    }
  }, [currentQuestion, phrases]);

  return (
    <Card className={classes.root}>
      <Button onClick={() => { setModalIsOpen(true) }} variant="contained">
        出題設定
      </Button>
      <SettingModal
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        numOfQuestions={numOfQuestions}
        setNumOfQuestions={setNumOfQuestions}
        setPhrases={setPhrases}
        isJapaneseToEnglish={isJapaneseToEnglish}
        setIsJapaneseToEnglish={setIsJapaneseToEnglish}
        currentPage={currentPage}
        setCurrentQuestion={setCurrentQuestion}
      />

      <CardContent>
        <Card className={classes.question}>
          <CardContent>
            <Typography variant="h5" component="h2">
              <div className={classes.question}>
                <Question
                  Phrases={phrases}
                  currentQuestion={currentQuestion}
                  isJapaneseToEnglish={isJapaneseToEnglish === 'japaneseToEnglish'}
                  isAnswer={isAnswer}
                />
              </div>
            </Typography>
          </CardContent>
          <div className={classes.checkboxButtonContainer}>
            <div className={classes.checkboxContainer}>
              <GreenCheckBox
                state={changeState1}
                isLock={false}
                toggleState={() => { setChangeState1(prev => !prev) }}
              />
              <YellowCheckBox
                state={changeState2}
                isLock={false}
                toggleState={() => { setChangeState2(prev => !prev) }}
              />
              <RedCheckBox
                state={changeState3}
                isLock={false}
                toggleState={() => { setChangeState3(prev => !prev) }}
              />
            </div>
            <div className={classes.answerButtonContainer}>
              <Button variant="contained" onClick={() => {setIsAnswer((prev) => (!prev))}} disabled={currentQuestion < 0 || currentQuestion >= numOfQuestions}>
                {isAnswer ? '問題に戻る' : '答えを見る'}
              </Button>
            </div>
          </div>
        </Card>
      </CardContent>

      {currentQuestion === (numOfQuestions - 1) ?
        <Button variant="contained" onClick={handleNextPage}>
          次の{numOfQuestions}問
        </Button>
        :
        <Button variant="contained" onClick={handleNextQuestion} disabled={currentQuestion < 0 || currentQuestion >= numOfQuestions}>
          次の問題
        </Button>
      }

    </Card>
  );
};

export default Hambarger;
