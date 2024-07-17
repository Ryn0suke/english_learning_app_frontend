import { Box, IconButton } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { Tag } from 'interfaces';
import { makeStyles, Theme } from '@material-ui/core/styles';

interface AddedTagsProps {
    tags: Tag[]
    setTags: (tags: Tag[]) => void
    //handleDeleteTag: (index: number) => void
};

const useStyles = makeStyles((theme: Theme) => ({
    tagBox: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: theme.spacing(1),
        marginTop: theme.spacing(2),
        margin: theme.spacing(2),
    },
    tag: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0.5, 1),
        backgroundColor: theme.palette.grey[300],
        borderRadius: theme.shape.borderRadius,
    },
    deleteTagButton: {
        marginLeft: theme.spacing(1),
    },
}));

const AddedTagsBox: React.FC<AddedTagsProps> = ({ tags, setTags }) => {
    const classes = useStyles();
    
    const handleDeleteTag = (index: number) => {
        const updatedTags = tags.filter((_, i) => i !== index);
        setTags(updatedTags);
    };

    return(
        <>
            <Box className={classes.tagBox}>
            {tags.map((tag, index) => (
                <div key={index} className={classes.tag}>
                    {tag.name}
                    <IconButton
                        size='small'
                        className={classes.deleteTagButton}
                        onClick={() => handleDeleteTag(index)}
                    >
                        <DeleteIcon fontSize='small' />
                    </IconButton>
                </div>
            ))}
            </Box>
        </>
    );
};

export default AddedTagsBox;

