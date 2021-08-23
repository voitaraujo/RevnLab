import React from 'react';
import Draggable from 'react-draggable';

import { makeStyles, createStyles, Theme } from '@material-ui/core'
import { TransitionProps } from '@material-ui/core/transitions';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Fade from '@material-ui/core/Fade';
import Slide from '@material-ui/core/Slide';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';


interface IProps {
  children: React.ReactChild,
  title: string,
  buttonLabel?: string | React.ReactElement,
  buttonIcon?: React.ReactElement,
  buttonType?: 'contained' | 'outlined' | 'text',
  buttonColor?: 'primary' | 'secondary'
}

export const DraggableDialog = (props: IProps) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        variant={props.buttonType}
        startIcon={props.buttonIcon}
        color={props.buttonColor}
        onClick={handleClickOpen
        }>
        {props.buttonLabel}
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        TransitionComponent={FadeTransition}
      >
        <DialogTitle
          style={{ cursor: 'move' }}
          id="draggable-dialog-title"
        >
          {props.title}
        </DialogTitle>
        <DialogContent>
          {props.children}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            color="secondary"
          >
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export const FullScreenDialog = (props: IProps) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant={props.buttonType} color={props.buttonColor} onClick={handleClickOpen}>
        {props.buttonLabel}
      </Button>
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={SlideTransition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Inventário de
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              Gravar
            </Button>
          </Toolbar>
        </AppBar>
        {props.children}
      </Dialog>
    </div>
  );
}

const PaperComponent = (props: any) => {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      position: 'relative',
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
  }),
);

const FadeTransition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) {
  return <Fade ref={ref} {...props} />;
});

const SlideTransition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});