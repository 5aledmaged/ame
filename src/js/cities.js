/*const fs = require("fs");
let data = fs.readFileSync("cities.json", "utf8");
let country = fs.readFileSync("countries.json", "utf8");
data = JSON.parse(data);
country = JSON.parse(country);
let sorted = [];

for (let i = 0; i < data.length; i++) {
	let s = country[data[i].country];
	let c = data[i].name;
	let id = data[i].id;
	let city = {
		city: c + ', ' + s,
		id: id
	}
	sorted.push(city);
}

function compare(a, b) {
  console.log(a);
  const genreA = a.city.toUpperCase();
  const genreB = b.city.toUpperCase();

  let comparison = 0;
  if (genreA > genreB) {
    comparison = 1;
  } else if (genreA < genreB) {
    comparison = -1;
  }
  return comparison;
}

sorted.sort(compare);

try {
	fs.writeFileSync('sorted2.json', JSON.stringify(sorted));
}
catch (e) {
	console.log("Cannot write file ", e);
}

console.log('finished');*/

const fs = require("fs");
let data = fs.readFileSync("sorted.json", "utf8");
data = JSON.parse(data);
const re = /.*Egypt$/;
data = data.filter(function(a) {
	return re.test(a.city);
});
console.log(data.length);
try {
	fs.writeFileSync('egy.json', JSON.stringify(data));
}
catch (e) {
	console.log("Cannot write file ", e);
}