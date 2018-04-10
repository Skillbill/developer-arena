import firebase from 'firebase';
import store from '../store';

const fakeUser = () => {
  let uid = sessionStorage.getItem('uid');
  if(!uid) {
    uid = Math.floor(Math.random() * 1000).toString();
    sessionStorage.setItem('uid', uid);
  }
  return {
    uid,
    displayName: `User ${uid}`,
    email: 'fake@email.com',
    emailVerified: true,
    isAnonymous: false,
    phoneNumber: null,
    photoURL: '/static/graphics/assets/dummy/user.svg',
    providerData: [
      {
        displayName: `User ${uid}`,
        email: 'fake@email.com',
        phoneNumber: null,
        photoURL: '/static/graphics/assets/dummy/user.svg',
        providerId: 'fake',
        uid
      }
    ]
  }
};

const createSessionUser = () => {
  sessionStorage.setItem('user', JSON.stringify(fakeUser()));
}

const getSessionUser = () => {
  const sessionItem = sessionStorage.getItem('user');
  if(sessionItem) {
    const user = JSON.parse(sessionItem);
    user.getIdToken = () => {
      return Promise.resolve(user.uid);
    }
    return user;
  } else {
    return null;
  }
}

const auth = {
  isDevMode() {
    return store.state.configuration.firebase.devMode;
  },
  getEnabledProviders: () => {
    return store.state.configuration.firebase.providers || [];
  },
  signOut() {
    if(this.isDevMode()) {
      sessionStorage.removeItem('user');
      location.reload();
    } else {
      firebase.auth().signOut();
    }
  },
  initializeApp() {
    if(!this.isDevMode()) {
      firebase.initializeApp(store.state.configuration.firebase);
    }
  },
  onAuthStateChanged(fn) {
    if(this.isDevMode()) {
      fn(getSessionUser());
    } else {
      firebase.auth().onAuthStateChanged(fn);
    }
  },
  getRedirectResult() {
    if(this.isDevMode()) {
      return Promise.resolve({user: getSessionUser()});
    } else {
      return firebase.auth().getRedirectResult();
    }
  },
  fetchProvidersForEmail(email) {
    if(this.isDevMode()) {
      return Promise.resolve();
    } else {
      return firebase.auth().fetchProvidersForEmail(email);
    }
  },
  signInWithEmailAndPassword(email, password) {
    if(this.isDevMode()) {
      createSessionUser();
      setTimeout(() => location.reload());
      return Promise.resolve();
    } else {
      return firebase.auth().signInWithEmailAndPassword(email, password);
    }
  },
  signInWithRedirect(provider) {
    if(this.isDevMode()) {
      createSessionUser();
      setTimeout(() => location.reload());
      return Promise.resolve();
    } else {
      return firebase.auth().signInWithRedirect(provider);
    }
  },
  getProvider(providerName) {
    if(this.isDevMode()) {
      return {
        name: 'fake',
        addScope() {
        }
      };
    } else {
      return new firebase.auth[providerName]();
    }
  },
  sendPasswordResetEmail(email) {
    if(this.isDevMode()) {
      return Promise.reject(new Error('Impossible to send emails in devMode'));
    } else {
      return firebase.auth().sendPasswordResetEmail(email);
    }
  },
  createUserWithEmailAndPassword(email, password) {
    if(this.isDevMode()) {
      return Promise.reject(new Error('Impossible to create users in devMode'));
    } else {
      return firebase.auth().createUserWithEmailAndPassword(email, password);
    }
  }
}

export default auth;
