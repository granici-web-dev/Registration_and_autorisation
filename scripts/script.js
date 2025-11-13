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

const registerForm = document.querySelector('#registerForm');

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

// Первый символ +, Максимум 12 чисел, Минимум 8 чисел, Только числа

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

function hasSpecialSymbol(password) {
  const symbols = ['!', '.', '&'];

  return symbols.some((symbols) => password.includes(symbols));
}

//Минимум 5 символов, максимум 26 символов, Спец символы ('!', '.', '&')
function isPasswordValid(password) {
  
  if (password.length >= 5 && password.length <= 26 && hasSpecialSymbol(password)) {
    return true;
  }

  return false
};


function isAlreadyRegistered(email, users) {
  const resultAlready = users.some((user) => email === user.email);
  // console.log(resultAlready);
  console.log(email);
  return resultAlready;
  
  // users.some((user) => email === user.email);
}






registerForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const nameInput = event.target.elements['name']; //получаем в JS ipnut name через type: name
  const passwordInput = event.target.elements['password']; //получаем в JS ipnut password через type: name
  const emailInput = event.target.elements['email'];
  const phoneNumberInput = event.target.elements['tel'];
  
  const resultOfName = isNameValid(nameInput.value.trim());
  const resultOfPhone = isPhoneValid(phoneNumberInput.value.trim());
  const resultOfPassword = isPasswordValid(passwordInput.value.trim());
  const resultOfEmail = isEmailValid(emailInput.value.trim());
  const resultAlready = isAlreadyRegistered(emailInput.value.trim(), users);

  console.log(resultOfName);
  console.log(resultOfPhone);
  console.log(resultOfPassword);
  console.log(resultOfEmail);
  console.log(resultAlready);
  


  if (
    // emailInput.value.trim() &&
    // passwordInput.value.trim() &&
    isNameValid(nameInput.value.trim()) &&
    isEmailValid(emailInput.value.trim()) &&
    isPhoneValid(phoneNumberInput.value.trim()) &&
    !isAlreadyRegistered(emailInput.value.trim(), users) &&
    isPasswordValid(passwordInput.value.trim())
  ) {
    //проверка если все true
    const newUser = {
      //создаем новый объект
      Name: nameInput.value,
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




