Function.prototype.myCall = function(context, ...params) {
  context.myFun = this
  context.myFun(...params)
}

Function.prototype.myApply = function(context, paramsArr) {
  context.myFun = this
  context.myFun(...paramsArr)
}

Function.prototype.myBind = function(context, ...args) {
  context.myFun = this
  return (...newArgs) => {
    context.myFun(...args, ...newArgs)
  }
}

function printFullName(city, state) {
  console.log(this.firstName + ' ' + this.lastName + ' is from ' + city + ', ' + state)
}

const person1 = {
  firstName: 'Kishan',
  lastName: 'Patel',
}

const person2 = {
  firstName: 'Bhoomi',
  lastName: 'Shah',
}

printFullName.myCall(person1, 'Surendranagar', 'Gujarat') // output: Kishan Patel is from Surendranagar, Gujarat
printFullName.myApply(person1, ['Surendranagar', 'Gujarat']) // output: Kishan Patel is from Surendranagar, Gujarat

const printablePerson1 = printFullName.myBind(person1, 'Surendranagar')
const printablePerson2 = printFullName.myBind(person2, 'Limbdi');

printablePerson1('Gujrat'); // output: Kishan Patel is from Surendranagar, Gujarat
printablePerson1('Maharastra'); // output: Kishan Patel is from Surendranagar, Maharastra
printablePerson2('Gujrat'); // output: Bhoomi Shah is from Limbdi, Gujrat