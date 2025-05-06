var a = 100

function foo() {
  a = 20
  console.log("inside", a)
}

a = 10
foo()

console.log("outside", a)