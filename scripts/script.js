const registerForm = document.querySelector('#registerForm');

const users = JSON.parse(localStorage.getItem('users')) || [];

function validateLogin(value, list) {
  const hasLoginInAList = list.some((user) => {
    return value === user.login;
  });
  return !hasLoginInAList;
}

registerForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const loginInput = event.target.elements['login']; //получаем в JS ipnut login через type: name
  const passwordInput = event.target.elements['password']; //получаем в JS ipnut password через type: name

  if (loginInput.value && passwordInput.value && validateLogin(loginInput.value, users))  { //проверка если все true
    const newUser = {
      //создаем новый объект
      login: loginInput.value,
      password: passwordInput.value,
    };

    users.push(newUser); //добавляем объкт в массив

    localStorage.setItem('users', JSON.stringify(users)); // сохраняем объект в localStorage

    loginInput.value = '';
    passwordInput.value = ''; // можно и registerForm.reset()
  } else {
    console.log('user with such email aleady has been registered');
  }
});
