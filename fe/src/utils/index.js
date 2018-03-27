import store from '../store'

export function getApiUrl(path) {
  return configuration.serverAddress + '/' + configuration.apiVersion + path;
}

export function getDefaultHeaders({auth} = {}) {
  const headers = {
    'Accept-Language': store.state.language
  }
  if(auth && store.state.user) {
    return store.state.user.getIdToken().then(token => {
      headers['Authorization'] = `Bearer ${token}`;
      return Promise.resolve(headers);
    });
  } else {
    return Promise.resolve(headers);
  }
}

export function getApiErrorMessage(error) {
  if(!error.response) {
    return 'api.errors.network';
  } else if(error.response.data.error) {
    // TODO get message based on server error code
    return error.response.data.error;
  }

  return 'api.errors.generic';
}
