function sayHello(val) {
  console.log('val==>', val)
  console.log('hello' + val)
}

function sayGoodBye(val) {
  console.log('bye' + val)
}

module.exports = {
  sayHello,
  sayGoodBye
}

// exports.sayGoodBye = sayGoodBye