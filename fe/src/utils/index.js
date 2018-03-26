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
  if(error && error.response && error.response.data && error.response.data.message) {
    // TODO get message based on server error code
    return error.response.data.message;
  }
  return 'api.errors.generic';
}
