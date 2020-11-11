// Создаем переменную, в которую положим кнопку меню
let menuToggle = document.querySelector('#menu-toggle');
// Создаем переменную, в которую положим меню
let menu = document.querySelector('.sidebar');
// отслеживаем клик по кнопке меню и запускаем функцию 
menuToggle.addEventListener('click', event => {
  // отменяем стандартное поведение ссылки
  event.preventDefault();
  // вешаем класс на меню, когда кликнули по кнопке меню 
  menu.classList.toggle('visible');
});

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

const listUsers = [{
    id: '1',
    email: 'oleg@gmail.com',
    password: '1111',
    displayName: 'OlegF'
  },
  {
    id: '2',
    email: 'max@gmail.com',
    password: '54321',
    displayName: 'Max'
  }
];

const setUsers = {
  user: null,
  logIn(email, password, callback) {
    if (!regExpValidEmail.test(email)) {
      return alert('Email не действителен');
    }

    const user = this.getUser(email);
    if (user && user.password === password) {
      this.authorizedUser(user);
      callback();
    } else {
      alert('Пользователя с такими данными не существует');
    }
  },
  logOut(callback) {
    this.user = null;
    callback();
  },
  signUp(email, password, callback) {
    if (!regExpValidEmail.test(email)) {
      return alert('Email не действителен');
    }

    if (!email.trim() || !password.trim()) {
      return alert('Введите email и пароль');
    }

    if (!this.getUser(email)) {
      const user = {
        email,
        password,
        displayName: email.substr(0, email.indexOf('@'))
      };

      listUsers.push(user);
      this.authorizedUser(user);
      callback();
    } else {
      alert('Пользователь с таким email уже зарегистрирован');
    }
  },
  getUser(email) {
    return listUsers.find(item => item.email === email);
  },
  editUser(username, userPhoto, callback) {
    if (username) {
      this.user.displayName = username;
    }

    if (username) {
      this.user.photo = userPhoto;
    }

    callback();
  },
  authorizedUser(user) {
    this.user = user;
  },
};

const toggleAuthDom = () => {
  const user = setUsers.user;

  if (user) {
    loginElem.style.display = 'none';
    userElem.style.display = '';
    usernameElem.textContent = user.displayName;
    userAvatarElem.src = user.photo || userAvatarElem.src;
  } else {
    loginElem.style.display = '';
    userElem.style.display = 'none';
  }
};

loginForm.addEventListener('submit', event => {
  event.preventDefault();
  setUsers.logIn(emailInput.value, passwordInput.value, toggleAuthDom);
  loginForm.reset();
});

loginSignup.addEventListener('click', event => {
  event.preventDefault();
  setUsers.signUp(emailInput.value, passwordInput.value, toggleAuthDom);
  loginForm.reset();
});

exitElem.addEventListener('click', event => {
  event.preventDefault();
  setUsers.logOut(toggleAuthDom);
});

editElem.addEventListener('click', event => {
  event.preventDefault();
  editContainer.classList.toggle('visible');
});

editContainer.addEventListener('click', event => {
  event.preventDefault();
  setUsers.editUser(editUsername.value, editPhotoURL.value, toggleAuthDom);
});

toggleAuthDom();