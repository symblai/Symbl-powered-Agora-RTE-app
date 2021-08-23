import React, { useCallback, useEffect, useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { inputLabels } from '../../../state/settings/settingsReducer';
import Button from '@material-ui/core/Button';
//import {getAccessToken} from "../../../utils/symbl/utils";
import Link from '@material-ui/core/Link';

import { v4 as uuidv4 } from 'uuid';
import symblConfig from '../../SymblConfig';
import { Symbl } from '../../bridge/rtc/web/symbl';

const useStyles = makeStyles({
  formControl: {
    display: 'block',
    // margin: '0.8em 0',
    '&:first-child': {
      margin: '0 0 0.8em 0',
    },
  },
  label: {
    width: '133%', // Labels have scale(0.75) applied to them, so this effectively makes the width 100%
  },
});

const withDefault = (val) =>
  val && typeof val === 'undefined' ? 'default' : val;

const hexRegex = new RegExp('[0-9a-f]+');

const getAccessToken = async (appId, appSecret) => {
  console.log(JSON.parse(appId).appId);

  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  const raw = JSON.stringify({
    type: 'application',
    appId: JSON.parse(appId).appId,
    appSecret: JSON.parse(appSecret).appSecret,
  });

  const Options = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  const resp = await fetch(
    'https://api-dev.symbl.ai/oauth2/token:generate',
    Options,
  );
  return resp.json();
};
/*
export const postData = async (url = '', data = {}, options = { credentialsInHeader: false }) => {
    const {credentialsInHeader, appId, appSecret, accessToken} = options;

    const headers = {};

    if (credentialsInHeader && appId) {
        headers['x-app-id'] =  appId;
    }

    if (credentialsInHeader && appSecret) {
        headers['x-app-secret'] =  appSecret;
    }

    if (!credentialsInHeader && accessToken) {
        headers['x-api-key'] =  accessToken;
    }

    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
            ...headers
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
};

const getAccessToken = async ({appId, appSecret}) => {
    if (appId && appSecret ) {
        const apiBase = process.env.SYMBL_API_BASE_PATH || 'https://api.symbl.ai';
        return await postData(`${apiBase}/oauth2/token:generate`, {
            type: 'application',
            appId,
            appSecret
        });
    } else {
        const endpoint = process.env.REACT_APP_SYMBL_TOKEN_ENDPOINT || '/symbl-token';
        const resp = await fetch(`${endpoint}`, { headers: new window.Headers(), mode: 'cors'});
        return resp.json();
    }
}*/

export default function CredentialsOptions(props) {
  const [appId, setAppID] = useState('');
  const [appSecret, setAppSecret] = useState('');
  const [credentialsValid, setCredentialsValid] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(true);
  const { onClose, open } = props;
  //    const [close,setClose]=useState(true);
  const classes = useStyles();

  const handleChange = useCallback(
    (e) => {
      //dispatchSetting({name: e.target.name, value: e.target.value});
    },
    //[dispatchSetting]
  );

  const handleNumberChange = useCallback(
    (e) => {
      if (!/[^\d]/.test(e.target.value)) {
        handleChange(e);
      }
    },
    [handleChange],
  );

  const handleAppIdChange = useCallback((e) => {
    setAppID(e.target.value);
  }, []);
  const handleAppSecretChange = useCallback((e) => {
    setAppSecret(e.target.value);
  }, []);

  const validateAppId = (appId) => {
    return (
      appId &&
      (appId.length === 64 || appId.length === 32) &&
      hexRegex.test(appId)
    );
  };

  const validateAppSecret = (appSecret) => {
    console.log('validating appsecret' + appSecret);
    return (
      appSecret &&
      (appSecret.length === 128 || appSecret.length === 64) &&
      hexRegex.test(appSecret)
    );
  };
  //let open=false;
  const close = () => {
    console.log('inside on close', dialogOpen);
    const x = document.getElementById('dc');

    setDialogOpen(true);
  };
  /*useEffect(()=>{
        setDialogOpen(false);
    },[close]);*/

  return (
    <Dialog onClose={onClose} open={open} disableBackdropClick={true}>
      <DialogContent id={'dc'}>
        <Grid item xs={12}>
          <Typography variant="body2">
            Please add appId and appSecret. You can find your credentials on
            <Link
              color={'secondary'}
              target="_blank"
              rel="noopener"
              href="https://platform.symbl.ai"
            >
              {' '}
              Symbl Console
            </Link>
            .
          </Typography>
          <Typography variant="body1" style={{ marginTop: 10 }}>
            Symbl Credentials:
          </Typography>
          <Typography variant="body2">
            These settings cannot be changed when connected to a room.
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <FormControl className={classes.formControl}>
            <TextField
              disabled={false}
              fullWidth
              id={uuidv4()}
              label="App ID"
              placeholder="897174314759235a356e4d4c4254314f7665684237585a76327a45ba37535649"
              name={'APP_ID'}
              value={appId}
              onChange={handleAppIdChange}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl className={classes.formControl}>
            <TextField
              disabled={false}
              fullWidth
              id={uuidv4()}
              label="App Secret"
              placeholder="91544a6c374b7349736d56416b7836746135416b3162434f4e4271745033f8702d6542625773cf33356168583150776643724a30475a7a7a79453278434e5971"
              name={'symblAppSecret'}
              value={appSecret}
              onChange={handleAppSecretChange}
            />
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button
            disabled={false} //{!validateAppId({appId}) || !validateAppSecret({appSecret})}
            variant={'contained'}
            onClick={async () => {
              try {
                console.log({ appId });
                console.log(appSecret);
                const result = await getAccessToken(
                  JSON.stringify({ appId }),
                  JSON.stringify({ appSecret }),
                );
                console.log(result);
                const { accessToken, message } = result;
                if (accessToken) {
                  console.log(accessToken);
                  window.localStorage.setItem('symblToken', accessToken);
                  localStorage.setItem('symblAppId', { appId });
                  localStorage.setItem('symblAppSecret', { appSecret });

                  symblConfig.symbl_AppId = JSON.stringify({ appId });
                  symblConfig.symbl_AppId = JSON.stringify({ appSecret });
                  //setSymblCred(JSON.stringify({appId}),JSON.stringify({appSecret}));
                  setCredentialsValid(true);
                  console.log('creaedntials valid' + credentialsValid);
                  onClose;
                } else {
                  setCredentialsValid(false);
                  console.log('creaedntials valid' + credentialsValid);
                  onClose;
                }
              } catch (e) {
                setCredentialsValid(false);
              }
            }}
          >
            Validate
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Typography
            hidden={credentialsValid === null || credentialsValid === true}
            color={'error'}
            style={{
              marginTop: 10,
            }}
          >
            Provided AppId and AppSecret are not valid.
          </Typography>
          <Typography
            hidden={!credentialsValid}
            style={{
              marginTop: 10,
              color: 'green',
            }}
          >
            AppId and AppSecret are valid.
          </Typography>
        </Grid>
        <DialogActions>
          <Button
            disabled={!credentialsValid}
            className={classes.button}
            onClick={onClose}
          >
            Done
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
