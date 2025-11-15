// Имя {
//  Минимум 2 символа
//  Максимум 24 символа
//  Только буквы
// }
// Эмейл {
//  Наличие символа@
//  Минимум 7 символов
// }
// Телефон {
//  Первый символ +
//  Максимум 12 чисел
//  Минимум 8 чисел
//  Только числа
// }
// Пароль {
//  Минимум 5 символов
//  максимум 26 символов
//  Спец символы ('!', '.', '&')
// }

// const userData = [
//   {

//   }
// ]

// Разделить логин и регистрацию на экраны с возможностью перехода по страницам, а также добавить экран профиля где после логина нужно отображать имя пользователя, почту пользователя, кнопки выйти и удалить аккаунт. К объекту пользователя добавить поле token (необходимо сгенерировать при создании пользователя любым способом, например, Math.random()). При авторизации пользователя его токен необходимо сохранять в localStorage отдельным полем authToken. При перезагрузки страницы нужно проверить наличие этого токена в хранилище, в зависимости от этого показывать его акаунт или отправлять на страницу логина. При клике на кнопку удалить аккаунт - удалять authToken и объект пользователя из массива объектов в хранилище и переводить на страницу регистрации. При клике на кнопку выйти из аккаунта - удалять authToken и переводить на страницу логина.

const registerForm = document.querySelector('#registerForm');
const loginForm = document.querySelector('#loginForm');

const users = JSON.parse(localStorage.getItem('users')) || [];


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

  // console.log('Проверки прошли имя');
  
  return true;

};



// Функция, которая валидирует email (Наличие символа@, Минимум 7 символов)
function isEmailValid(email) {
    return email.length >= 7 && email.includes('@');
}

// Функция, которая валидирует телефон. Первый символ +, Максимум 12 чисел, Минимум 8 чисел, Только числа
function isPhoneValid(phone) {

  if (phone[0] != '+') {
    return false
  }

  for (let i = 1; i < phone.length; i++) {
    if (phone[i] < '0' || phone[i] > '9') {
      return false;
    }
  }

  if (phone.length - 1 <= 8 || phone.length - 1 >= 12) {
    return false;
  }
  // console.log('Проверки прошли телефон');
  return true
}

// Функция, которая проверяет, если есть символ из массива
function hasSpecialSymbol(password) {
  const symbols = ['!', '.', '&'];
  return symbols.some((symbols) => password.includes(symbols));
}

// Функция, которая валидирует пароль. Минимум 5 символов, максимум 26 символов, Спец символы ('!', '.', '&')
function isPasswordValid(password) {
  if (password.length >= 5 && password.length <= 26 && hasSpecialSymbol(password)) {
    return true;
  }

  return false
};

// Функция, которая проверяет, если пользователь с такимж email уже зарегистрирован
function isAlreadyRegistered(email, users) {
  const resultAlready = users.some((user) => email === user.email);
  return resultAlready;
}


registerForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const nameInput = event.target.elements['name']; //получаем в JS ipnut name через type: name
  const passwordInput = event.target.elements['password']; //получаем в JS ipnut password через type: name
  const emailInput = event.target.elements['email'];
  const phoneNumberInput = event.target.elements['tel'];


  if (
    isNameValid(nameInput.value.trim()) &&
    isEmailValid(emailInput.value.trim()) &&
    isPhoneValid(phoneNumberInput.value.trim()) &&
    !isAlreadyRegistered(emailInput.value.trim(), users) &&
    isPasswordValid(passwordInput.value.trim())
  ) {
    //проверка если все true
    const newUser = {
      //создаем новый объект
      name: nameInput.value,
      email: emailInput.value,
      phoneNumber: phoneNumberInput.value,
      password: passwordInput.value,
    };

    users.push(newUser); //добавляем объкт в массив

    localStorage.setItem('users', JSON.stringify(users)); // сохраняем объект в localStorage

    nameInput.value = '';
    emailInput.value = '';
    phoneNumberInput.value = '';
    passwordInput.value = ''; // можно и registerForm.reset()
  } else {
    console.log('user with such email aleady has been registered');
  }
});


const isUserRegistered = (user, listOfRegisteredUsers) =>
  listOfRegisteredUsers.every((registeredUser) => {
    return registeredUser.email === user.email && registeredUser.password === user.password;
  });

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const emailInput = event.target.elements['email'];
  const passwordInput = event.target.elements['password'];

  if (emailInput.value && passwordInput.value) {
    const registeredUser = {
      email: emailInput.value,
      password: passwordInput.value,
    };

    if (isUserRegistered(registeredUser, users)) {
      loginForm.reset();
      console.log('Success, you are authorized ');
    } else {
      console.log('Invalid data');
    }
  }
});