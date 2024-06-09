import React, { useState, useEffect, useContext } from 'react';
//import { useNavigate } from 'react-router-dom';
import { AuthContext } from 'App';
import { viewAllPhrases, createNewPhrases, updatePhrases, destoyPhrases } from 'lib/api/cradPhrases';
import { Phrase } from 'interfaces';

import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';

import Modal from 'react-modal';
import RegisterAndSearchModal from 'components/modals/Phrases/RegisterAndSearchModal';



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
        top: "20%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        minWidth: "40%",
    }
  });

const Phrases: React.FC = () => {

    const { currentUser } = useContext(AuthContext);
    const [phrases, setPhrases] = useState<Phrase[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(1);
    const pageNumbers: number[] = [...new Array(totalPage).keys()].map(number => ++number).slice(Math.max(0, currentPage - 6), Math.min(totalPage, currentPage + 4));
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

    const recieveAllPhrases = async (page:number) => {
        try {
            if (currentUser?.id === undefined) {
                console.log('User ID is undefined');
                return;
            }
            const res = await viewAllPhrases(currentUser.id, page);
            console.log(res.data)
            setPhrases(res.data.phrases);
            setTotalPage(res.data.total_pages);
            console.log(res);
            console.log(phrases);
        } catch (err) {
            console.log(err);
        }
    };

    const handleDeletePhrase = async (id:number) => {
        try {
            if (currentUser?.id === undefined) {
                console.log('User ID is undefined');
                return;
            }
            const res = await destoyPhrases(id);
            console.log(res);
            await recieveAllPhrases(currentPage);
        } catch (err) {
            console.log(err);
        }
    };

    const changeCurrentPage = (page:number) => {
        setCurrentPage(page);
    };
 

    useEffect(() => {
        recieveAllPhrases(currentPage);
    }, [currentUser, currentPage]);

    
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
        <Button className={classes.button} onClick={() => setModalIsOpen(true)}>登録・検索</Button>

        <RegisterAndSearchModal modalIsOpen={modalIsOpen} setModalIsOpen={setModalIsOpen} recieveAllPhrases={recieveAllPhrases} currentPage={currentPage}/>

        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label='phrase table'>
                <TableHead>
                    <TableRow>
                        <TableCell>日本語</TableCell>
                        <TableCell>英語</TableCell>
                        <TableCell>タグ</TableCell>
                        <TableCell>削除</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {phrases?.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell component='th' scope='row'>
                                {row.japanese}
                            </TableCell>
                            <TableCell component='th' scope='row'>
                                {row.english}
                            </TableCell>
                            <TableCell component='th' scope='row'>
                            {row.tags !== undefined ? (
                                row.tags.map((tag) => (
                                <div key={tag.id}>{tag.name}</div>
                                ))
                            ) : (
                                <div></div>
                            )}
                            </TableCell>


                            <TableCell>
                                <Button className={classes.button} variant='contained' onClick={() => handleDeletePhrase(row.id)}>
                                    <DeleteIcon />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
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