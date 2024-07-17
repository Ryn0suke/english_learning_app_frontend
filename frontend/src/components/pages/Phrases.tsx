import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from 'App';
import { viewAllPhrases } from 'lib/api/cradPhrases';
import { Phrase, SearchOptions, Tag } from 'interfaces';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';

import RegisterAndSearchModal from 'components/modals/Phrases/RegisterAndSearchModal';
import UpdateModal from 'components/modals/Phrases/UpdateModal';
import CheckState from 'components/modals/Phrases/CheckState';

import CommonButton from 'components/ui/Button';

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 650,
    },
    modal: {
        top: '20%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        minWidth: '40%',
    },
    japaneseColumn: {
        width: '200px', // 日本語列の固定幅
    },
    englishColumn: {
        width: '200px', // 英語列の固定幅
    },
    checkStateColumn: {
        width: '150px', // チェック状態列の固定幅
    },
    tagsColumn: {
        width: '300px', // タグ列の固定幅
    },
}));

const Phrases: React.FC = () => {
    const { currentUser } = useContext(AuthContext);
    const [phrases, setPhrases] = useState<Phrase[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(1);
    const pageNumbers: number[] = [...new Array(totalPage).keys()].map(number => ++number).slice(Math.max(0, currentPage - 6), Math.min(totalPage, currentPage + 4));
    const [registerModalIsOpen, setRegisterModalIsOpen] = useState<boolean>(false);
    const [updateModalIsOpen, setUpdateModalIsOpen] = useState<boolean>(false);
    const [selectedPhrase, setSelectedPhrase] = useState<Phrase>({id: -1, japanese: '', english: '', state1: false, state2: false, state3: false, tags:[]});
    const [searchOptions, setSearchOptions] = useState<SearchOptions>({japanese: '', english: '', tags: [{name: ''}], isPartialMatch: true});

    const recieveAllPhrases = async (page: number, searchOptions: SearchOptions) => {
        try {
            if (currentUser?.id === undefined) {
                console.log('User ID is undefined');
                return;
            }
            console.log('Search Options:', searchOptions); 
            const res = await viewAllPhrases(currentUser.id, page, searchOptions);
            console.log(res.data)
            setPhrases(res.data.phrases);
            setTotalPage(res.data.total_pages);
            console.log(res);
            console.log(phrases);
        } catch (err) {
            console.log(err);
        }
    };

    const changeCurrentPage = (page:number) => {
        setCurrentPage(page);
    };

    useEffect(() => {
        recieveAllPhrases(currentPage, searchOptions);
    }, [currentUser, currentPage, searchOptions]);

    const classes = useStyles();

    console.log(currentUser);

    phrases.map((row) => {
        if (row.tags !== undefined) {
            row.tags.map((tag) => {
                console.log(tag.name);
            })
        }
    });

    return (
        <>
            <CommonButton onClick={() => setRegisterModalIsOpen(true)} children='登録・検索'/>
            <CommonButton onClick={() => setSearchOptions({japanese: '', english: '', tags: [{name: ''}], isPartialMatch: true})} children='検索解除'/>

            <RegisterAndSearchModal registerModalIsOpen={registerModalIsOpen} setRegisterModalIsOpen={setRegisterModalIsOpen} recieveAllPhrases={recieveAllPhrases} currentPage={currentPage} searchOptions={searchOptions} setSearchOptions={setSearchOptions}/>

            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label='phrase table'>
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.japaneseColumn}>日本語</TableCell>
                            <TableCell className={classes.englishColumn}>英語</TableCell>
                            <TableCell className={classes.checkStateColumn}>チェック状態</TableCell>
                            <TableCell className={classes.tagsColumn}>タグ</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {phrases?.map((row) => (
                            <TableRow key={row.id} onClick={() => {setUpdateModalIsOpen(true); setSelectedPhrase({id: row.id, japanese: row.japanese, english: row.english, state1: row.state1, state2: row.state2, state3: row.state3, tags: row.tags});}}>
                                <TableCell component='th' scope='row' className={classes.japaneseColumn}>
                                    {row.japanese}
                                </TableCell>
                                <TableCell component='th' scope='row' className={classes.englishColumn}>
                                    {row.english}
                                </TableCell>
                                <TableCell className={classes.checkStateColumn}>
                                    <CheckState state1={row.state1} state2={row.state2} state3={row.state3} isLock={true}/>
                                </TableCell>
                                <TableCell component='th' scope='row' className={classes.tagsColumn}>
                                    {row.tags !== undefined ? (
                                        <div>
                                            {row.tags.map((tag) => (
                                                <Chip
                                                    key={tag.id}
                                                    label={tag.name}
                                                    style={{ marginRight: '8px', marginBottom: '4px' }}
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <div></div>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                        <UpdateModal updateModalIsOpen={updateModalIsOpen} setUpdateModalIsOpen={setUpdateModalIsOpen} recieveAllPhrases={recieveAllPhrases} currentPage={currentPage} phrase={selectedPhrase} searchOptions={searchOptions}/>
                    </TableBody>
                </Table>
            </TableContainer>
            <CommonButton onClick={() => changeCurrentPage(1)} children='＜'/>

            {
                pageNumbers.map((page) => {
                    return (
                        // <Button key={page} className={page === currentPage ? classes.currentPageButton : classes.button} onClick={() => changeCurrentPage(page)}>{page}</Button>
                        <CommonButton onClick={() => changeCurrentPage(page)} children={page} color={page === currentPage ? 'secondary' : 'primary'}/>
                    )
                })
            }
            <CommonButton onClick={() => changeCurrentPage(totalPage)} children='＞'/>
        </>
    );
}

export default Phrases;

