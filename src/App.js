import React from 'react';
import logo from './logo.svg';
import './App.scss';
import { Tabs, Tab, Drawer } from "@material-ui/core"

import store, {reset} from "./store.js"

import { withStyles, useTheme, Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

import { Provider } from "react-redux"



import Base from "./base"
import Trainer from "./trainer"
import Models from "./models"

import { SnackbarProvider } from 'notistack'

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';
import Sidebar from './sidebar';
import FeatureSet from './trainer/Features/Feature'
import FeatureStore from './featurestore'
import { ClearAll, Clear, Restore, DeleteOutline, SaveOutlined, FolderOpen } from '@material-ui/icons';


const fs = window.require('fs')
const { dialog } = window.require('electron').remote

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary:{
      main: "#0090E7",
      dark: "#0090E7"
    },
    success: {
      main: "#00D25B",
      dark: "#00D25B"
    },
    secondary: {
      main: "#FC424A",
      dark: "#FC424A"
    }
  },
})

const iconstyle = {
  fill: "inherit",
  fontSize: "inherit"
}


const AntTabs = withStyles((theme: Theme) =>
  createStyles({
    root: {
      borderBottom: '1px solid #00000022',
    },
    indicator: {
      backgroundColor: theme.palette.primary.main,
    },
  }))(Tabs);

const AntTab = withStyles((theme: Theme) =>
  createStyles({
    root: {
      textTransform: 'none',
      minWidth: 72,
      fontSize: 20,
      fontWeight: theme.typography.fontWeightRegular,
      marginRight: theme.spacing(4),
      color: theme.palette.text.secondary,
      '&:hover': {
        color: theme.palette.common.white,
        opacity: 1,
      },
      '&$selected': {
        color: theme.palette.common.white,
        fontWeight: theme.typography.fontWeightMedium,
      },
      '&:focus': {
        color: theme.palette.common.white,
      },
    },
    selected: {},
  }),
)((props) => <Tab disableRipple {...props} />);



const drawerWidth = 280;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: theme.spacing(0.2),
      marginLeft: theme.spacing(0.2)
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
      backgroundColor: "#181B23",
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      height: 49,
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: 'flex-end',
      backgroundColor:"#181B23"
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(0),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -drawerWidth,
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
  }),
);



export default function App() {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(0);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  function a11yProps(index: any) {
    return {
      onClick: () => setValue(index)
    };
  }

  function save() {
    const present = store.getState().undoable.present 
    dialog.showSaveDialog({
      defaultPath:"MyModel",
      filters:[
        {name: 'DeepTrack Set (.dts)', extensions:['dts']}
      ]
    }).then(({filePath}) => {
        if (filePath) {
          fs.writeFileSync(filePath, JSON.stringify(present))
        }
        
    })
  }
  

  function load() {
    dialog.showOpenDialog({
      properties:[
        "openFile",
      ],
      filters:[
        {name: 'DeepTrack Set (.dts)', extensions:['dts']},
        {name: 'All Files', extensions: ['*']}
      ]
    }).then(({filePaths}) => {
      if (filePaths && filePaths.length > 0) {
        const present = fs.readFileSync(filePaths[0])
        if (present) {
          try {
            store.dispatch({type: "SET_STATE", present: JSON.parse(present)})
          } catch (error) {
            
          }
        }
      }
    })
  }

  document.onkeydown = function(e) {
    if (e.ctrlKey && e.key === 'z') {
      e.preventDefault();
    }
  }

  return (
    <Provider store={store}>
      <SnackbarProvider maxSnack={3}>
        <MuiThemeProvider theme={theme}>
          <div className={classes.root}>
            <CssBaseline />
            <Drawer
              className={classes.drawer}
              variant="persistent"
              anchor="left"
              open={open}
              classes={{
                paper: classes.drawerPaper,
              }}
            >
              <div className={classes.drawerHeader}>
                <Typography variant="h4">
                  Features
                </Typography>
                <IconButton onClick={handleDrawerClose} style={{height:49}}>
                  {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
              </div>
              <Divider />
              <FeatureStore key={open ? "open" : "closed"}/>
            </Drawer>
            <div
              className={clsx(classes.content, {
                [classes.contentShift]: open,
              }) + " root"}
            >
              {/* <div className={classes.drawerHeader} /> */}
              
              <Sidebar theme={theme}>
                <div style={{height:49, display:"flex", width: "100%"}} >
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={() => {open ? handleDrawerClose() : handleDrawerOpen()}}
                        edge="start"
                        className={clsx(classes.menuButton)}
                      >
                        <MenuIcon />
                      </IconButton>
                    <Typography style={{lineHeight:"49px", textAlign:"left", textIndent: 20}} variant="h4">
                        DeepTrack 2.0
                    </Typography>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={reset}
                        edge="end"
                        className={clsx(classes.menuButton)}
                      >
                        <DeleteOutline/>
                      </IconButton>
                      <IconButton
                        color="inherit"
                        aria-label=""
                        onClick={save}
                        edge="end"
                        className={clsx(classes.menuButton)}
                      >
                        <SaveOutlined/>
                      </IconButton>
                      <IconButton
                        color="inherit"
                        aria-label=""
                        onClick={load}
                        edge="end"
                        className={clsx(classes.menuButton)}
                      >
                        <FolderOpen/>
                      </IconButton>
                </div>
              
                <FeatureSet theme={theme} />
              </Sidebar>
              <div id="main">
                <div style={{ width: "100%", backgroundColor: "#111", flexDirection: "row", display: "flex" }}>
                  <AntTabs value={value}
                    onChange={(e, value) => setValue(value)}>
                    <AntTab label="Visualize dataset">
                    </AntTab>
                    <AntTab label="Train model">
                    </AntTab>
                    <AntTab label="Predict" color="s">
                    </AntTab>
                  </AntTabs>
                </div>

                <div style={{ width: "100%" }} hidden={value !== 0}>
                  <Trainer theme={theme}></Trainer>
                </div>

                <div style={{ width: "100%" }} hidden={value !== 1}>
                  <Models theme={theme} />
                </div>

                <div style={{ width: "100%" }} hidden={value !== 2}>
                  <Base theme={theme}></Base>
                </div>
              </div>
            </div>
          </div>
          
        </MuiThemeProvider>
      </SnackbarProvider>
    </Provider>
  );
}

{/* <div className={classes.appBarShift + " root"}>
            
          </div> */}