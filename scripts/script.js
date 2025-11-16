// === Получаем элементы, которые МОГУТ быть на странице ===
const registerForm = document.querySelector('#registerForm');
const loginForm = document.querySelector('#loginForm');

const profileTitle = document.querySelector('.profileTitle');
const profileEmail = document.querySelector('.profileEmail');
const profileExit = document.querySelector('.profileExit');
const profileDelete = document.querySelector('.profileDelete');

// Читаем пользователей и токен из localStorage
let users = JSON.parse(localStorage.getItem('users')) || [];
const authToken = localStorage.getItem('authToken');
const currentUser = users.find((user) => String(user.token) === authToken) || null;

// Функция, которая валидирует name (Минимум 2 символа, Максимум 24 символа, Только буквы)
const isNameValid = (name) => {
  console.log(name);

  if (name.length < 2 || name.length > 24) return false;
  for (let i = 0; i < name.length; i++) {
    const char = name[i];
    if (!((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z'))) {
      return false;
    }
  }

  return true;
};

// Функция, которая валидирует email (Наличие символа@, Минимум 7 символов)
function isEmailValid(email) {
  return email.length >= 7 && email.includes('@');
}

// Функция, которая валидирует телефон. Первый символ +, Максимум 12 чисел, Минимум 8 чисел, Только числа
function isPhoneValid(phone) {
  if (phone[0] != '+') {
    return false;
  }

  for (let i = 1; i < phone.length; i++) {
    if (phone[i] < '0' || phone[i] > '9') {
      return false;
    }
  }

  if (phone.length - 1 <= 8 || phone.length - 1 >= 12) {
    return false;
  }

  return true;
}

// Функция, которая проверяеи если есть спец символ из масиива
function hasSpecialSymbol(password) {
  const symbols = ['!', '.', '&'];

  return symbols.some((symbols) => password.includes(symbols));
}

// Функция, которая валидирует пароль. Минимум 5 символов, максимум 26 символов, Спец символы ('!', '.', '&')
function isPasswordValid(password) {
  if (password.length >= 5 && password.length <= 26 && hasSpecialSymbol(password)) {
    return true;
  }

  return false;
}

// Функция, которая проверяет если есть такой зарегистрированный юзер
function isAlreadyRegistered(email, users) {
  const resultAlready = users.some((user) => email === user.email);
  return resultAlready;
}


// Регистрация
if (registerForm) {
  // Если уже авторизован → сразу на профиль
  if (currentUser) {
    window.location.href = '/profile.html';
  }

  registerForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const nameInput = event.target.elements['name'];
    const emailInput = event.target.elements['email'];
    const phoneInput = event.target.elements['tel'];
    const passwordInput = event.target.elements['password'];

    const nameVal = nameInput.value.trim();
    const emailVal = emailInput.value.trim();
    const phoneVal = phoneInput.value.trim();
    const passVal = passwordInput.value.trim();

    if (
      isNameValid(nameVal) &&
      isEmailValid(emailVal) &&
      isPhoneValid(phoneVal) &&
      isPasswordValid(passVal) &&
      !isAlreadyRegistered(emailVal, users)
    ) {
      const newUser = {
        name: nameVal,
        email: emailVal,
        phoneNumber: phoneVal,
        password: passVal,
        token: String(Math.random()), 
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      registerForm.reset();
      // после регистрации на логин
      window.location.href = '/login.html';
    } else {
      console.log('Ошибка регистрации: невалидные данные или email уже занят');
    }
  });
}

// Логин
const isUserDataValid = (user, registeredUsers) =>
  registeredUsers.some(
    (registeredUser) =>
      registeredUser.email === user.email && registeredUser.password === user.password,
  );

if (loginForm) {
  // Если уже авторизован → сразу на профиль
  if (currentUser) {
    window.location.href = '/profile.html';
  }

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const emailInput = event.target.elements['email'];
    const passwordInput = event.target.elements['password'];

    const emailVal = emailInput.value.trim();
    const passVal = passwordInput.value.trim();

    if (emailVal && passVal) {
      const loginData = {
        email: emailVal,
        password: passVal,
      };

      if (isUserDataValid(loginData, users)) {
        const user = users.find((u) => u.email === loginData.email);

        localStorage.setItem('authToken', String(user.token));
        loginForm.reset();
        window.location.href = '/profile.html';
      } else {
        console.log('Ошибка входа: неверный email или пароль');
      }
    } else {
      console.log('Ошибка: заполните email и пароль');
    }
  });
}

// Профиль
if (profileTitle || profileEmail || profileExit || profileDelete) {
  // Мы на profile.html

  if (!currentUser) {
    // Нет токена или пользователь не найден возращаем на логин
    window.location.href = '/login.html';
  } else {
    // Подставляем имя и почту
    if (profileTitle) {
      profileTitle.textContent = `Welcome, ${currentUser.name}`;
    }

    if (profileEmail) {
      profileEmail.textContent = currentUser.email;
    }

    // Кнопка Exit: удаляем authToken, уходим на логин
    if (profileExit) {
      profileExit.addEventListener('click', () => {
        localStorage.removeItem('authToken');
        window.location.href = '/login.html';
      });
    }

    // Кнопка Delete: удаляем юзера и токен, уходим на регистрацию
    if (profileDelete) {
      profileDelete.addEventListener('click', () => {
        const usersFromStorage = JSON.parse(localStorage.getItem('users')) || [];
        const updatedUsers = usersFromStorage.filter(
          (user) => String(user.token) !== String(currentUser.token),
        );

        localStorage.setItem('users', JSON.stringify(updatedUsers));
        localStorage.removeItem('authToken');

        window.location.href = '/index.html';
      });
    }
  }
}
