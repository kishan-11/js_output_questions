const array = [8, 18, 28, 38];
const result = array.map(element => element + 2)
               .filter((element) => element > 25);
console.log(result);