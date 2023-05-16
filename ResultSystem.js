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
	SNPointer: 0,
	add(vals) {
		theList.addItem(vals, this.SNPointer++);
	},
	del(vals) { //vals arr has only one el, the serial no
		
	},
	display() {
		console.log(theList.display());
	},
	end() {
		
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
ask();