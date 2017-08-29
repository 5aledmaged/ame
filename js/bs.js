'use strict';
function binarySearch(db, low, high, key) {
	let mid, midCity, midId;
	key = key.toUpperCase();
	while (low < high) {
		mid = Math.floor(low + (high - low) / 2);
		midCity = db[mid].city.toUpperCase();
		midId = db[mid].id;
		if (midCity === key) {
			return midId;
		}
		else if (midCity > key) {
			high = mid - 1;
		}
		else {
			low = mid + 1;
		}
	}
}

function lowerBound(db, low, high, key) {
	let mid, midCity, midId;
	let re = new RegExp('^' + key, 'i');
	while (low <= high) {
		mid = Math.floor(low + (high - low) / 2);
		midCity = db[mid].city.toUpperCase();
		midId = db[mid].id;
		if (re.test(midCity) || midCity > key) {
			high = mid - 1;
		}
		else {
			low = mid + 1;
		}
	}
	return low;
}

function upperBound(db, low, high, key) {
	let mid, midCity, midId;
	let re = new RegExp('^' + key, 'i');
	while (low <= high) {
		mid = Math.floor(low + (high - low) / 2);
		midCity = db[mid].city.toUpperCase();
		midId = db[mid].id;
		if (re.test(midCity) || midCity < key) {
			low = mid + 1;
		}
		else {
			high = mid - 1;
		}
	}
	return low;
}


const fs = require("fs");
let data = fs.readFileSync("sorted.json", "utf8");
data = JSON.parse(data);

const t0 = Date.now();
let cityId = binarySearch(data, 0, 209564, 'Alexandria, Egypt');
let lower = lowerBound(data, 0, 209564, 'PE');
let upper = upperBound(data, 0, 209564, 'PE');
console.log("City ID = " + cityId);
console.log("lower = " + lower);
console.log(data[lower]);
console.log("upper = " + upper);
console.log(data[upper-1]);
const t1 = Date.now();
console.log("runtime: " + (t1 - t0) + " ms.");
