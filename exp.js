// "use strict";
// function memoize(fn) {
//   // Твій код тут (використовуй замикання для збереження об'єкта cache)
//   const cache = new Map();

//   return function (x) {
//     if (cache.has(x)) {
//       return cache.get(x);
//     }
//     const res = fn(x);
//     cache.set(x, res);
//     return res;
//   };
// }

// // Приклад для тестування:
// const slowDouble = (x) => {
//   console.log("Рахую...");
//   return x * 2;
// };

// const fastDouble = memoize(slowDouble);

// console.log(fastDouble(5)); // Виведе: "Рахую..." потім 10
// console.log(fastDouble(5)); // Виведе: 10 (миттєво, без "Рахую...")
// console.log(fastDouble(10)); // Виведе: "Рахую..." потім 20
/////////////////////////////////////////////
////////////////////////////////////////////
// function debounce(recipeFn, delay) {
//   // Твій код тут (знадобляться setTimeout та clearTimeout)
//   let timer;
//   return function () {
//     clearTimeout(timer);
//     timer = setTimeout(() => {
//       recipeFn(...arguments);
//     }, delay);
//   };
// }

// // Тест:
// const processSearch = (query) => console.log(`Шукаю: ${query}`);
// const debouncedSearch = debounce(processSearch, 500);

// // Імітуємо швидке введення тексту користувачем:
// debouncedSearch("j");
// debouncedSearch("ja");
// debouncedSearch("jav");
// debouncedSearch("javas");
// // Лише цей виклик має спрацювати через 500 мс після останнього кліку:
// debouncedSearch("javascript");
//////////////////////////
////////////////////////////

// const url = [
//   "https://jsonplaceholder.typicode.com/users/",
//   "https://jsonplaceholder.typicode.com/posts?userId=",
//   "https://jsonplaceholder.typicode.com/todos?userId=",
// ];

// const getInfoUser = async (id) => {
//   const res = {};
//   const dataUser = [];
//   try {
//     for (const el of url) {
//       const res = await fetch(`${el}${id}`);
//       dataUser.push(await res.json());
//     }

//     await Promise.all([...dataUser]).then((v) => {
//       ((res.profile = v[0]), (res.posts = v[1]), (res.todos = v[2]));
//     });
//     return res;
//   } catch (err) {
//     console.log(err.message);
//   }
// };

// console.log(getInfoUser(1).then((v) => console.log(v)));

// const url = [
//   "https://jsonplaceholder.typicode.com/users/",
//   "https://jsonplaceholder.typicode.com/posts?userId=",
//   "https://jsonplaceholder.typicode.com/todos?userId=",
// ];

// const getInfoUser = async (id) => {
//   try {
//     const fetchProm = url.map((endpoind) => fetch(`${endpoind}${id}`));
//     const res = await Promise.all(fetchProm);

//     for (const el of res) {
//       if (!el.ok) throw new Error(`Response status: ${response.status}`);
//     }

//     const [aaaaa, bbbbbb, cccccccc] = await Promise.all(
//       res.map((i) => i.json()),
//     );
//     return { aaaaa, bbbbbb, cccccccc };

//     // console.log(res);
//   } catch (err) {
//     console.log(err.message);
//   }
// };

// // Тест
// getInfoUser(1)
//   .then((data) => console.log("Успіх! Отримані дані:", data))
//   .catch((err) => console.log("Помилка в тесті:", err));
// ..................

// function deepClone(obj) {
//   if (obj === null || typeof obj !== "object") {
//     return obj;
//   }

//   const clone = Array.isArray(obj) ? [] : {};

//   for (const key in obj) {
//     // if (!Object.hasOwn(object, key)) continue;

//     clone[key] = deepClone(obj[key]);
//   }
//   return clone;
// }
// const original = {
//   name: "Олексій",
//   skills: ["JS", "React"],
//   address: {
//     city: "Київ",
//     coordinates: { lat: 50.45, lng: 30.52 },
//   },
// };
// // deepClone(original);
// const clone = deepClone(original);
// clone.address.coordinates.lat = 49.0; // Змінюємо координату в клоні
// clone.skills.push("Node.js"); // Змінюємо масив у клоні

// console.log(original.address.coordinates.lat); // Має залишитися 50.45!
// console.log(original.skills); // Має залишитися ["JS", "React"] (без Node.js)

//////////////////////////////////////

// function throttle(recipeFn, limit) {
//   // Твій код тут (використовуй прапорець-запобіжник або обчислення часу через Date.now())
//   // const time = Date.now();
//   let isBloc = false;

//   return function (...args) {
//     if (isBloc) return;
//     const d = 5;
//     recipeFn(...args);
//     isBloc = true;

//     setTimeout(() => {
//       isBloc = false;
//     }, limit);
//   };
// }

// // Тест:
// const logClick = (g) => console.log("Клік зафіксовано!", g);
// const throttledClick = throttle(logClick, 1000);

// // Імітуємо швидкі кліки що-100 мілісекунд:
// const interval = setInterval(throttledClick, 100);

// // Через 3.5 секунди зупинимо тест.
// // За цей час (3500 мс) з лімітом в 1000 мс функція має вивести напис у консоль рівно 4 рази.
// setTimeout(() => clearInterval(interval), 3500);
// ...............................

// Напиши власну реалізацію стандартного методу Function.prototype.bind
// під назвою customBind.Твоя функція має додаватися до прототипу всіх функцій,
//   приймати контекст(context) та будь - яку кількість початкових аргументів(каррирування),
//     а потім повертати нову функцію, яку також можна викликати з додатковими аргументами.

// Function.prototype.customBind = function (context, ...args) {
//   // Твій код тут
//   // Підказка: this всередині цієї функції вказує на саму функцію, яку ми біндимо
//   const originalFn = this;
//   return function (...newArgs) {
//     return originalFn.apply(context, [...args, ...newArgs]);
//   };
// };
// Function.prototype.customBind = function (context, ...args) {
//   const originalFn = this;
//   return function (...newArgs) {
//     // Робимо те саме, але розгортаємо аргументи через кому всередині .call
//     return originalFn.call(context, ...args, ...newArgs);
//   };
// };
// // Тест:
// const user = {
//   name: "Марія",
// };

// function greet(greeting, punctuation) {
//   return `${greeting}, ${this.name}${punctuation}`;
// }

// // Прив'язуємо контекст "user" та перший аргумент "Привіт"
// const greetMaria = greet.customBind(user, "Привіт");

// // Викликаємо нову функцію і передаємо залишок аргументів
// console.log(greetMaria("!")); // Має вивести: "Привіт, Марія!"

// const arr = [
//   { name: "Alex", age: 20, isActive: false },
//   { name: "Bro", age: 20, isActive: false },
//   { name: "Jon", age: 20, isActive: false },
// ];

// // const foo = arr.filter((item) => item.isActive);
// // console.log(foo);

// Array.prototype.castomReduce = function (cb) {
//   for (let i = 0; i < this.length; i++) {
//     // console.log("this", this);
//     if (cb) return true;
//   }
// };

// // Array.prototype.castomFilter = castomFilter;
// const foo = arr.some((item) => item.isActive);
// console.log(foo);

// Function.prototype.customBind = function (context, ...args) {
//   // Твій код тут
//   // Підказка: this всередині цієї функції вказує на саму функцію, яку ми біндимо
//   const originalFn = this;
//   return function (...newArgs) {
//     return originalFn.apply(context, [...args, ...newArgs]);
//   };
// };
/////////////////////////////
const developer = {
  name: "Іван",
  skills: ["JavaScript", "TypeScript", "React"],
  showSkills() {
    // Зараз тут звичайна функція, і line-виклики втрачають this
    this.skills.forEach(function (skill) {
      console.log(`${this.name} знає ${skill}`);
    });
  },
};

// developer.showSkills();
// Очікується: "Іван знає JavaScript", "Іван знає TypeScript" і т.д.
// Зараз виводить: "undefined знає JavaScript"
// \\\\\\\\\\\\\\\\\\\\\\\\\\\

const calculator = {
  a: 0,
  b: 0,
  read(x, y) {
    this.a = x;
    this.b = y;
  },
  sum() {
    return this.a + this.b;
  },
  mul() {
    return this.a * this.b;
  },
};

// calculator.read(5, 10);
// console.log(calculator.sum()); // Має вивести 15, але зараз буде NaN або помилка
// console.log(calculator.mul()); // Має вивести 50

// Ми перебуваємо в глобальному просторі. Тут `this` — це `window`.
/////////////////////////
const ladder = {
  step: 0,
  // Твій код тут
  up() {
    this.step += 1;
    return this;
  },
  down() {
    this.step -= 1;
    return this;
  },
  showStep() {
    console.log(this.step);
  },
};

// Тест (має працювати саме такий синтаксис):
// ladder.up().up().down().up().showStep(); // Має вивести в консоль: 2

////////////////////////////////////

// // Твій код тут:
// class EventEmitter {
//   on() {}
//   emit() {}
//   off() {}
// }

// // Тест:
// const emitter = new EventEmitter();

// const greet = (name) => console.log(`Привіт, ${name}!`);
// const ciao = (name) => console.log(`Чао, ${name}!`);

// emitter.on("user-login", greet);
// emitter.on("user-login", ciao);

// // Має вивести і "Привіт, Андрій!", і "Чао, Андрій!"
// emitter.emit("user-login", "Андрій");

// emitter.off("user-login", ciao);

// // Має вивести тільки "Привіт, Сергій!" (бо ciao ми видалили)
// emitter.emit("user-login", "Сергій");

Function.prototype.customApply = function (context, args = []) {
  context = context || globalThis;

  const fn = Symbol();

  context[fn] = this;

  const result = context[fn](...args);

  delete context[fn];

  return result;
};

// Example
function greet(city, country) {
  console.log(`Hi, I'm ${this.name} from ${city}, ${country}`);
}

const person = { name: "Alice" };

greet.customApply(person, ["Paris", "France"]);
// Hi, I'm Alice from Paris, France
