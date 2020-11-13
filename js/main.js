const firebaseConfig = {
  apiKey: "AIzaSyDyAlQ1KiF9mZj2ZT2wXMgyH0nxoDQD1A0",
  authDomain: "pikadu-a5453.firebaseapp.com",
  databaseURL: "https://pikadu-a5453.firebaseio.com",
  projectId: "pikadu-a5453",
  storageBucket: "pikadu-a5453.appspot.com",
  messagingSenderId: "144662957783",
  appId: "1:144662957783:web:3acea046b0bdb4125baa92"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


// Создаем переменную, в которую положим кнопку меню
const menuToggle = document.querySelector('#menu-toggle');
// Создаем переменную, в которую положим меню
const menu = document.querySelector('.sidebar');

const regExpValidEmail = /^\w+@\w+\.\w{2,}$/;
const loginElem = document.querySelector('.login');
const loginForm = document.querySelector('.login-form');
const emailInput = document.querySelector('.login-email');
const passwordInput = document.querySelector('.login-password');
const loginSignup = document.querySelector('.login-signup');
const userElem = document.querySelector('.user');
const usernameElem = document.querySelector('.user-name');
const exitElem = document.querySelector('.exit');
const editElem = document.querySelector('.edit');
const editContainer = document.querySelector('.edit-container');
const editUsername = document.querySelector('.edit-username');
const editPhotoURL = document.querySelector('.edit-photo');
const userAvatarElem = document.querySelector('.user-avatar');
const DEFAULT_PHOTO = userAvatarElem.src;
const postsWrapper = document.querySelector('.posts');
const addPostElem = document.querySelector('.add-post');
const buttonNewPost = document.querySelector('.button-new-post');
const modalBackdrop = document.querySelector('.modal-backdrop');
const modalContainer = document.querySelector('.modal-container');
const passwordForgetElem = document.querySelector('.login-forget');
const likesElem = document.querySelector('.likes');

const setUsers = {
  user: null,
  initUser(callback) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.user = user;
      } else {
        this.user = null;
      }

      if (callback) {
        callback();
      }
    });
  },
  logIn(email, password) {
    if (!regExpValidEmail.test(email)) {
      return alert('Email не действителен');
    }

    firebase.auth().signInWithEmailAndPassword(email, password)
      .catch(error => {
        const errCode = error.code;
        const errMessage = error.message;

        if (errCode === 'auth/wrong-password') {
          alert('Неверный пароль');
        } else if (errCode === 'auth/user-not-found') {
          alert('Пользователя с такими данными не найден');
        } else {
          alert(errMessage);
        }
      });
  },
  logOut() {
    firebase.auth().signOut();
  },
  signUp(email, password, callback) {
    if (!regExpValidEmail.test(email)) {
      return alert('Email не действителен');
    }

    if (!email.trim() || !password.trim()) {
      return alert('Введите email и пароль');
    }

    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(() => {
        this.editUser(email.substring(0, email.indexOf('@')), null, callback)
      })
      .catch(error => {
        const errCode = error.code;
        const errMessage = error.message;

        if (errCode === 'auth/weak-password') {
          alert('Задайте более сложный пароль');
        } else if (errCode === 'auth/email-already-in-use') {
          alert('Пользователь с таким email уже зарегистрирован');
        } else {
          alert(errMessage);
        }
      });
  },
  editUser(displayName, photoURL, callback) {
    const user = firebase.auth().currentUser;

    if (displayName) {
      if (photoURL) {
        user.updateProfile({
            displayName,
            photoURL
          })
          .then(callback);
      } else {
        user.updateProfile({
            displayName
          })
          .then(callback);
      }
    }
  },
  sendForgetPassword(email) {
    firebase.auth().sendPasswordResetEmail(email).then(() => {
      alert(`Письмо для сброса пароля отправлено на почту ${email}`)
    }).catch(error => {
      console.log(error);
    });
  }
};

const setPosts = {
  allPosts: [],
  addPost(title, text, tags, callback) {
    this.allPosts.unshift({
      id: `postID${(+new Date()).toString(16)}-${setUsers.user.uid}`,
      title,
      text,
      tags: tags ? tags.split(',').map(item => item.trim()) : [],
      author: {
        displayName: setUsers.user.displayName,
        photoURL: setUsers.user.photoURL || DEFAULT_PHOTO
      },
      date: new Date().toLocaleString(),
      likes: 0,
      comments: 0
    });

    firebase.database().ref('post').set(this.allPosts)
      .then(() => this.getPosts(callback));
  },
  getPosts(callback) {
    firebase.database().ref('post').on('value', snapshot => {
      this.allPosts = snapshot.val() || [];
      callback();
    });
  },
  likePost(id) {
    const post = this.allPosts[id];
    post.likes = post.likes + 1;

    let updates = {};
    updates['/post/' + id] = post;

    firebase.database().ref().update(updates);
  }
};

const toggleAuthDom = () => {
  const user = setUsers.user;

  if (user) {
    loginElem.style.display = 'none';
    userElem.style.display = '';
    usernameElem.textContent = user.displayName;
    userAvatarElem.src = user.photoURL || DEFAULT_PHOTO;
    buttonNewPost.classList.add('visible');
  } else {
    loginElem.style.display = '';
    userElem.style.display = 'none';
    buttonNewPost.classList.remove('visible');
  }
};

const showAllPosts = () => {
  let postHTML = '';

  setPosts.allPosts.forEach((post, i) => {
    let tags = post.tags || [];

    postHTML += `
     <section data-post-id="${i}" class="post">
        <div class="post-body">
          <h2 class="post-title">${post.title}</h2>
          <p class="post-text">${post.text}</p>
          <div class="tags">
            ${tags.map(tag => `<a href="#" class="tag">#${tag}</a>`).join('')}
          </div>
        </div>
        <div class="post-footer">
          <div class="post-buttons">
            <button class="post-button likes">
              <svg width="19" height="20" class="icon icon-like">
                <use xlink:href="img/icons.svg#like"></use>
              </svg>
              <span class="likes-counter">${post.likes}</span>
            </button>
            <button class="post-button comments">
              <svg width="21" height="21" class="icon icon-comment">
                <use xlink:href="img/icons.svg#comment"></use>
              </svg>
              <span class="comments-counter">${post.comments}</span>
            </button>
            <button class="post-button save">
              <svg width="19" height="19" class="icon icon-save">
                <use xlink:href="img/icons.svg#save"></use>
              </svg>
            </button>
            <button class="post-button share">
              <svg width="17" height="19" class="icon icon-share">
                <use xlink:href="img/icons.svg#share"></use>
              </svg>
            </button>
          </div>
          <div class="post-author">
            <div class="author-about">
              <a href="#" class="author-username">${post.author.displayName}</a>
              <span class="post-time">${post.date}</span>
            </div>
            <a href="#" class="author-link"><img src="${post.author.photoURL}" alt="avatar" class="author-avatar"></a>
          </div>
        </div>
      </section>
    `;
  });

  postsWrapper.innerHTML = postHTML;
}

const init = () => {
  // отслеживаем клик по кнопке меню и запускаем функцию 
  menuToggle.addEventListener('click', event => {
    // отменяем стандартное поведение ссылки
    event.preventDefault();
    // вешаем класс на меню, когда кликнули по кнопке меню 
    menu.classList.toggle('visible');
  });

  loginForm.addEventListener('submit', event => {
    event.preventDefault();
    setUsers.logIn(emailInput.value, passwordInput.value);
    loginForm.reset();
  });

  loginSignup.addEventListener('click', event => {
    event.preventDefault();
    setUsers.signUp(emailInput.value, passwordInput.value, toggleAuthDom);
    loginForm.reset();
  });

  exitElem.addEventListener('click', event => {
    event.preventDefault();
    setUsers.logOut();
  });

  editElem.addEventListener('click', event => {
    event.preventDefault();
    editContainer.classList.toggle('visible');
    editUsername.value = setUsers.user.displayName;
  });

  editContainer.addEventListener('submit', event => {
    event.preventDefault();
    setUsers.editUser(editUsername.value, editPhotoURL.value, toggleAuthDom);
    editContainer.classList.remove('visible');
  });

  buttonNewPost.addEventListener('click', event => {
    event.preventDefault();
    modalBackdrop.classList.add('visible');
    modalContainer.classList.add('visible');
  });

  modalContainer.addEventListener('click', event => {
    if (event.target.closest('.modal-dialog')) {
      return;
    }
    modalBackdrop.classList.remove('visible');
    modalContainer.classList.remove('visible');
  });

  addPostElem.addEventListener('submit', event => {
    event.preventDefault();
    const {
      title,
      text,
      tags
    } = addPostElem.elements;

    if (title.value.length < 6) {
      return alert('Слишком короткий заголовок');
    }

    if (text.value.length < 50) {
      return alert('Слишком короткий пост');
    }

    setPosts.addPost(title.value, text.value, tags.value, showAllPosts);

    modalBackdrop.classList.remove('visible');
    modalContainer.classList.remove('visible');
    addPostElem.reset();
  });

  passwordForgetElem.addEventListener('click', event => {
    event.preventDefault();
    setUsers.sendForgetPassword(emailInput.value);
    emailInput.value = '';
  });

  document.addEventListener('click', event => {
    event.preventDefault();
    const target = event.target;

    if (target.closest('.likes')) {
      const postID = target.closest('.post').dataset.postId;
      setPosts.likePost(postID);
    }
  });

  setUsers.initUser(toggleAuthDom);
  setPosts.getPosts(showAllPosts);
}

document.addEventListener('DOMContentLoaded', init)