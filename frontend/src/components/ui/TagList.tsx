import { MenuItem, Select, Checkbox, ListItemText, OutlinedInput } from '@material-ui/core';
import { Tag } from 'interfaces';

interface selectProps {
    selectedTags: Tag[]
    registeredTag: Tag[]
    handleTagChange: (event: React.ChangeEvent<{ value: unknown }>) => void

}

const TagList: React.FC<selectProps> = ({ selectedTags, registeredTag, handleTagChange}) => {
    return(
        <Select
        label="登録されているタグ"
        multiple
        value={selectedTags.map(tag => tag.name)}
        onChange={handleTagChange}
        input={<OutlinedInput label="登録されているタグ" />}
        renderValue={(selected) => (selected as string[]).join(', ')}
        >
        {registeredTag.map((tag) => (
            <MenuItem key={tag.id} value={tag.name}>
                <Checkbox checked={selectedTags.some(selectedTag => selectedTag.name === tag.name)} />
                <ListItemText primary={tag.name} />
            </MenuItem>
        ))}
        </Select>
    )
};


export default TagList;
