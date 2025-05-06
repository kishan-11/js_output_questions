function hello() {
  console.log("1");
    setTimeout(() => {
        console.log("2");
    })
  console.log("3");
}
hello();