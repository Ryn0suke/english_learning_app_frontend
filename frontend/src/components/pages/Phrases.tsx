import React, { useState, useEffect, useContext } from 'react';
//import { useNavigate } from 'react-router-dom';
import { AuthContext } from 'App';
import { viewAllPhrases, createNewPhrases, updatePhrases, destoyPhrases } from 'lib/api/cradPhrases';
import { Phrase, SearchOptions, Tag } from 'interfaces';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip'


import Modal from 'react-modal';
import RegisterAndSearchModal from 'components/modals/Phrases/RegisterAndSearchModal';
import UpdateModal from 'components/modals/Phrases/UpdateModal';



const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
    button: {
        background: 'blue',
        color: 'white'
    },
    currentPageButton: {
        background: 'red',
        color: 'white'
    },
    modal: {
        top: '20%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        minWidth: '40%',
    }
  });

const Phrases: React.FC = () => {

    const { currentUser } = useContext(AuthContext);
    const [phrases, setPhrases] = useState<Phrase[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(1);
    const pageNumbers: number[] = [...new Array(totalPage).keys()].map(number => ++number).slice(Math.max(0, currentPage - 6), Math.min(totalPage, currentPage + 4));
    const [registerModalIsOpen, setRegisterModalIsOpen] = useState<boolean>(false);
    const [updateModalIsOpen, setUpdateModalIsOpen] = useState<boolean>(false);
    const [selectedPhrase, setSelectedPhrase] = useState<Phrase>({id: -1, japanese: '', english: '', tags:[]});
    const [searchOptions, setSearchOptions] = useState<SearchOptions>({japanese: '', english: '', tags: [{name: ''}]});

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

    // const handleDeletePhrase = async (id:number) => {
    //     try {
    //         if (currentUser?.id === undefined) {
    //             console.log('User ID is undefined');
    //             return;
    //         }
    //         const res = await destoyPhrases(id);
    //         console.log(res);
    //         await recieveAllPhrases(currentPage);
    //     } catch (err) {
    //         console.log(err);
    //     }
    // };

    const changeCurrentPage = (page:number) => {
        setCurrentPage(page);
    };
 

    useEffect(() => {
        recieveAllPhrases(currentPage, searchOptions);
    }, [currentUser, currentPage, searchOptions]);

    
    const classes = useStyles();

    console.log(currentUser);

    phrases.map((row) => {
        // console.log(row.tags);
        if (row.tags !== undefined) {
            row.tags.map((tag) => {
                console.log(tag.name);
            })
        }
    })

    return (
        <>
        <Button className={classes.button} onClick={() => setRegisterModalIsOpen(true)}>登録・検索</Button>
        <Button className={classes.button} onClick={() => setSearchOptions({japanese: '', english: '', tags: [{name: ''}]})}>検索解除</Button>

        <RegisterAndSearchModal registerModalIsOpen={registerModalIsOpen} setRegisterModalIsOpen={setRegisterModalIsOpen} recieveAllPhrases={recieveAllPhrases} currentPage={currentPage} searchOptions={searchOptions} setSearchOptions={setSearchOptions}/>

        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label='phrase table'>
                <TableHead>
                    <TableRow>
                        <TableCell>日本語</TableCell>
                        <TableCell>英語</TableCell>
                        <TableCell>タグ</TableCell>
                        {/* <TableCell>削除</TableCell> */}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {phrases?.map((row) => (
                        <TableRow key={row.id} onClick={() => {setUpdateModalIsOpen(true); setSelectedPhrase({id: row.id, japanese: row.japanese, english: row.english, tags: row.tags});}}>
                            <TableCell component='th' scope='row'>
                                {row.japanese}
                            </TableCell>
                            <TableCell component='th' scope='row'>
                                {row.english}
                            </TableCell>
                            <TableCell component='th' scope='row'>
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



                            {/* <TableCell>
                                <Button className={classes.button} variant='contained' onClick={() => handleDeletePhrase(row.id)}>
                                    <DeleteIcon />
                                </Button>
                            </TableCell> */}
                        </TableRow>
                    ))}
                    <UpdateModal updateModalIsOpen={updateModalIsOpen} setUpdateModalIsOpen={setUpdateModalIsOpen} recieveAllPhrases={recieveAllPhrases} currentPage={currentPage} phrase={selectedPhrase} searchOptions={searchOptions}/>
                </TableBody>
            </Table>
        </TableContainer>
        <Button onClick={() => changeCurrentPage(1)}>＜</Button>
        {
            pageNumbers.map((page) => {
                return(
                    <Button key={page} className={page===currentPage ? classes.currentPageButton : classes.button} onClick={() => changeCurrentPage(page)}>{page}</Button>
                )

            })
        }
        <Button onClick={() => changeCurrentPage(totalPage)}>＞</Button>
        </>
    );
}

export default Phrases;