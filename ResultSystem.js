const readLine = require("readline");
const List = require("./LinkedList");

let rl = readLine.createInterface({
	input: process.stdin,
	output: process.stdout
});

//creating the LinkedList
let theList = new List();

//delegator obj got a couple methods to handle delegation... yes!
//yes! I said that... and yes, I didnt think it thru
delObj = {
	add(vals) {
		theList.addItem(vals);
	},
	del(vals) {
		theList.del(vals);
	},
	display() {
		console.log(theList.display());
	},
	end() {
		process.exit(0);
	}
};

function delegator(string) {
	//this parses the string(user input) and
	// delegates the right handler to handle the task
	let cmd = string.substring(0, string.indexOf(" ")) || string; //i put '|| string' in case we got an empty string for single word commands
	let restOfString = string.slice(cmd.length).trim();
	//parsing restOfString
	let vals = [];
	if(restOfString.startsWith("(")) { //note the '!'
		withoutBracs = restOfString.slice(1, restOfString.length - 1).trim();
		vals = withoutBracs.split(",").map(item => item.trim());
	} else {
		vals.push(restOfString.split(" ")[0]);
	}
	delObj[cmd.toLowerCase()](vals);
}

function ask() {
	rl.question("_", (resp) => {
		let handlerPromise = new Promise((resolve, reject) => {
			delegator(resp);
		});
		//the promise should resolve with a string indicating success or failure
		//handlerPromise.then(console.log);
		ask();
	});
}
//printing the usage
console.log(`\nUSAGE (Commands):\n_add (subject, C/A score, Exam Score)\n_del (S/N 1, S/N 2,... S/N n)\n_display\n_end\n`);
ask();