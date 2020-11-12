// Создаем переменную, в которую положим кнопку меню
let menuToggle = document.querySelector('#menu-toggle');
// Создаем переменную, в которую положим меню
let menu = document.querySelector('.sidebar');

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

const postsWrapper = document.querySelector('.posts');

const listUsers = [{
    id: '1',
    email: 'oleg@gmail.com',
    password: '1111',
    displayName: 'OlegF',
    photo: 'https://miro.medium.com/max/680/1*kuMkoz_T-gnF3RUDqRKYDQ.png'
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

    if (userPhoto) {
      this.user.photo = userPhoto;
    }

    callback();
  },
  authorizedUser(user) {
    this.user = user;
  },
};

const setPosts = {
  allPosts: [{
      title: 'Заголовлок поста 1',
      text: 'Далеко-далеко за словесными горами в стране гласных и согласных живут рыбные тексты. Языком что рот маленький реторический вершину текстов обеспечивает гор свой назад решила сбить маленькая дорогу жизни рукопись ему букв деревни предложения, ручеек залетают продолжил парадигматическая ? Но языком сих пустился, запятой своего его снова решила меня вопроса моей своих пояс коварный, власти диких правилами напоивший они текстов ipsum первую подпоясал ? Лучше, щеке подпоясал приставка большого курсивных на берегу своего ? Злых, составитель агентство что вопроса ведущими о решила одна алфавит!',
      tags: ['свежее', 'новое', 'горячее', 'мое', 'случайность'],
      author: 'oleg@gmail.com',
      date: '10.11.2020, 20:54:00',
      likes: 100500,
      comments: 80
    },
    {
      title: 'Заголовлок поста 2',
      text: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nisi ipsam dignissimos fugiat debitis cumque nemo, blanditiis, modi provident alias dolores exercitationem aut, quos perspiciatis illum iusto. Eaque, aliquam suscipit fugit, exercitationem adipisci obcaecati dignissimos quam a voluptates necessitatibus iure saepe! Dolorem sint sapiente, ducimus esse deserunt eveniet aspernatur consectetur obcaecati. Nisi perspiciatis sint asperiores sed voluptas vitae repudiandae. Earum, iure!',
      tags: ['свежее', 'новое', ],
      author: 'max@gmail.com',
      date: '11.11.2020, 20:54:00',
      likes: 45,
      comments: 20
    },
    {
      title: 'Заголовлок поста 3',
      text: 'Далеко-далеко за словесными горами в стране гласных и согласных живут рыбные тексты. Языком что рот маленький реторический вершину текстов обеспечивает гор свой назад решила сбить маленькая дорогу жизни рукопись ему букв деревни предложения, ручеек залетают продолжил парадигматическая ? Но языком сих пустился, запятой своего его снова решила меня вопроса моей своих пояс коварный, власти диких правилами напоивший они текстов ipsum первую подпоясал ? Лучше, щеке подпоясал приставка большого курсивных на берегу своего ? Злых, составитель агентство что вопроса ведущими о решила одна алфавит!',
      tags: ['свежее', 'новое', 'горячее', 'мое', 'случайность'],
      author: 'oleg@gmail.com',
      date: '10.11.2020, 20:54:00',
      likes: 100500,
      comments: 80
    }
  ]
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

const showAllPosts = () => {
  let postHTML = '';

  setPosts.allPosts.forEach(post => {
    let user = setUsers.getUser(post.author);
    let avatar = user ? user.photo ? user.photo : 'img/avatar.jpeg' : 'img/avatar.jpeg';

    postHTML += `
     <section class="post">
        <div class="post-body">
          <h2 class="post-title">${post.title}</h2>
          <p class="post-text">${post.text}</p>
          <div class="tags">
            ${post.tags.map(tag => `<a href="#" class="tag">#${tag}</a>`).join('')}
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
              <a href="#" class="author-username">${post.author.substring(0, post.author.indexOf('@'))}</a>
              <span class="post-time">${post.date}</span>
            </div>
            <a href="#" class="author-link"><img src="${avatar}" alt="avatar" class="author-avatar"></a>
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
    editUsername.value = setUsers.user.displayName;
  });

  editContainer.addEventListener('submit', event => {
    event.preventDefault();
    setUsers.editUser(editUsername.value, editPhotoURL.value, toggleAuthDom);
    editContainer.classList.remove('visible');
  });

  showAllPosts();
  toggleAuthDom();
}

document.addEventListener('DOMContentLoaded', init)