/* eslint-disable no-restricted-syntax */
const triangle = { a: 1, b: 2, c: 3 };

function ColoredTriangle() {
    this.color = 'red';
}

ColoredTriangle.prototype = triangle;

const obj = new ColoredTriangle();

Object.keys(obj).forEach( prop => {
	console.log(`obj.${prop} = ${obj[prop]}`);
});

// expected output: "obj.color = red"
