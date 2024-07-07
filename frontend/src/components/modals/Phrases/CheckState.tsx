import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Checkbox from '@material-ui/core/Checkbox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import { green, yellow, red, grey } from '@material-ui/core/colors';

interface RecieveProps {
    state1: boolean;
    state2: boolean;
    state3: boolean;
    isLock: boolean;
};

const useStyles = makeStyles({
    checkbox: {
        marginRight: 8,
    }
});

export const GreenCheckBox = ({ state, toggleState ,isLock }: { state: boolean, toggleState?: () => void, isLock: boolean }) => (
    <Checkbox
        checked={state}
        onChange={toggleState}
        icon={<CheckBoxOutlineBlankIcon style={{ color: green[500] }} />}
        checkedIcon={<CheckBoxIcon style={{ color: green[500] }} />}
        disabled={isLock}
    />
);

export const YellowCheckBox = ({ state, toggleState ,isLock }: { state: boolean, toggleState?: () => void, isLock: boolean }) => (
    <Checkbox
        checked={state}
        onChange={toggleState}
        icon={<CheckBoxOutlineBlankIcon style={{ color: yellow[700] }} />}
        checkedIcon={<CheckBoxIcon style={{ color: yellow[700] }} />}
        disabled={isLock}
    />
);

export const RedCheckBox = ({ state, toggleState ,isLock }: { state: boolean, toggleState?: () => void, isLock: boolean }) => (
    <Checkbox
        checked={state}
        onChange={toggleState}
        icon={<CheckBoxOutlineBlankIcon style={{ color: red[500] }} />}
        checkedIcon={<CheckBoxIcon style={{ color: red[500] }} />}
        disabled={isLock}
    />
);

export const GreyCheckBox = ({ state, toggleState ,isLock }: { state: boolean, toggleState?: () => void, isLock: boolean }) => (
    <Checkbox
        checked={state}
        onChange={toggleState}
        icon={<CheckBoxOutlineBlankIcon style={{ color: grey[500] }} />}
        checkedIcon={<CheckBoxIcon style={{ color: grey[500] }} />}
        disabled={isLock}
    />
);

const CheckState: React.FC<RecieveProps> = ({ state1, state2, state3, isLock }) => {
    return (
        <>
            <GreenCheckBox state={state1} isLock={isLock} />
            <YellowCheckBox state={state2} isLock={isLock} />
            <RedCheckBox state={state3} isLock={isLock} />
        </>
    );
};

export default CheckState;
