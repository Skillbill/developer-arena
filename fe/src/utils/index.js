import store from '../store'

export function getApiUrl(path) {
  return store.state.configuration.serverAddress + '/' + store.state.configuration.apiVersion + path;
}

export function getDefaultHeaders({auth} = {}) {
  const headers = {
    'Accept-Language': store.state.language
  }
  if(auth && store.state.user) {
    return store.state.user.getIdToken().then(token => {
      headers['Authorization'] = store.state.configuration.firebase.devMode ? token : `Bearer ${token}`;
      return Promise.resolve(headers);
    });
  } else {
    return Promise.resolve(headers);
  }
}

export function getApiErrorMessage(error) {
  if(error.message === 'Network Error') {
    return 'api.errors.network';
  } else if(error.response && error.response.data && error.response.data.error && error.response.data.error.msg) {
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

export function getTypesString(mimeTypesArray) {
  let types = mimeTypesArray.map(t => {
    let splitted = t.split('/');
    return splitted.length > 0 ? splitted[1] : splitted[0];
  });
  return types.join(', ');
}

export function getFileSizeString(bytesNumber) {
  return Math.floor(bytesNumber / 1024 / 1024) + 'MB';
}

export function getProjectImageUrl(project, {width, height}) {
  let params = {resizeType: 'cover', width, height, enlarge: true};
  let imageUrl = `/${store.state.configuration.apiVersion}/contest/${project.contestId}/project/${project.id}/image/`;
  let imageFile = getProjectFile(project, 'IMAGE');
  if(imageFile && imageFile.mtime) {
    params.ts = new Date(imageFile.mtime).getTime();
  }
  return getImageUrl(imageUrl, params);
}

export function getImageUrl(url, params = {}) {
  let basePath = store.state.configuration.serverAddress;
  if(store.state.configuration.tinyPictures && store.state.configuration.tinyPictures.enabled) {
    basePath = store.state.configuration.tinyPictures.url;
  }
  return basePath + url + '?' + getQueryString(params);
}

export function getQueryString(params = {}) {
  return Object.keys(params).map(key => {
    return `${key}=${encodeURIComponent(params[key])}`;
  }).join('&');
}

export function getProjectDeliverableUrl(project) {
  return `${store.state.configuration.serverAddress}/${store.state.configuration.apiVersion}` +
    `/contest/${project.contestId}/project/${project.id}/deliverable/`;
}

export function getProjectFile(project, kind) {
  if(project && project.files && project.files.length) {
    let files = project.files.filter(file => {
      return file.kind === kind;
    });
    if(files.length > 0) {
      return files[0];
    }
  }
  return null;
}

export function getProjectPreviewUrl(project) {
  return `/preview/${project.contestId}/${project.id}/`;
}
