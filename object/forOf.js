/* eslint-disable no-restricted-syntax */

function* fibonacci() {
    let [prev, curr] = [0, 1];

    while (true) {
        [prev, curr] = [curr, prev + curr];
        yield curr;
    }
}

let fiboGenerator = fibonacci();

for(let n = fiboGenerator.next().value; n <= 1597; n = fiboGenerator.next().value) {
	console.log(n);
}

// expected output:
// 1
// 2
// 3
// 5
// 8
// 13
// 21
// 34
// 55
// 89
// 144
// 233
// 377
// 610
// 987
// 1597
