import axios from 'axios';
import { CONFIG_SET } from './actionTypes';

const defaultConfig = {
  proxyUrl: 'http://localhost:8080',
};

function setConfig(config) {
  const action = {
    type: CONFIG_SET,
    config,
  };
  return action;
}

export default function getConfig(configUrl) {
  return (dispatch) => {
    axios.get(configUrl)
      .then((response) => {
        const { items } = response.data;
        const config = {
          ...items,
        };

        dispatch(setConfig(config));
      })
      .catch(() => {
        // TODO: There's probably soemthing better to do here than return
        // a default
        dispatch(setConfig(defaultConfig));
      });
  };
}
