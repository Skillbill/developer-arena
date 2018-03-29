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
  } else if(error.response.data && error.response.data.error && error.response.data.error.msg) {
    return error.response.data.error.msg;
  }
  return 'api.errors.generic';
}

export function getFeedback(data, type = 'ok') {
  let message = '';
  let args = null;
  if(typeof data === 'string') {
    message = data;
  } else {
    message = data.message;
    args = data.args;
  }
  return {message, args, type};
}

export function getYoutubeVideoKey (url) {
  const youtubeRegExpr = /^https:\/\/(?:youtu\.be\/|(?:www\.)?youtube\.com\/watch\?v=)(\w*)/;
  let videoKey = null;
  if(url) {
    let match = url.match(youtubeRegExpr);
    if(match && match.length === 2) {
      videoKey = match[1];
    }
  }
  return videoKey;
}
