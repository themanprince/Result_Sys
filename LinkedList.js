//let {execSync} = require("child_process");

//NOTE: THIS MODULE IS TAILORED FOR ResultSystem.js


//the SN auto var... my guess is, if I dont export it,
//it becomes part of the closure of this module's require() call
//also, it gets to stay private
//Win... Win
let SN = 0;
let winWidth = 50; //the char width of my terminal... tput cols nur work 
//this was gon be used by more than one func so I made it global... forgive me *crying*

class Node {
	constructor(val, prev = null, next = null) {
		//I'll assume val is the vals Array from ResultSystem
		//in the end of the next line, what I simply did is, "if its a number, parse it"
		["Subject", "C/A", "Exam"].forEach((item, i) => this[item] = parseFloat(val[i]) || val[i]);
		this["S/N"] = SN; //head node gets SN 0, and so on
		this.prev = prev;
		this.next = next;
	}
	get Total() {
		return this["Exam"] + this["C/A"];
	}
	get Grade() {
		let grades = new Map();
		grades.set([100, 70], "A");
		grades.set([69, 60], "B");
		grades.set([59, 50], "C");
		grades.set([49, 40], "D");
		grades.set([39, 0], "F");
		
		for(let key of grades.keys())
			if (this.Total <= key[0] && this.Total >= key[1])
				return grades.get(key);
	}
}

class LinkedList {
	constructor() {
		this.head = new Node(["head"]);
		this.percentWidths = new Map(); //for buildLine method... i didnt want to have to recreate it everytime
		this.percentWidths.set(0, 10);
		this.percentWidths.set(1, 40);
		this.percentWidths.set(2, 10);
		this.percentWidths.set(3, 10);
		this.percentWidths.set(4, 10);
		this.percentWidths.set(5, 10);
	}
	
	getItem(SN) {
		let current = this.head.next || this.head;
		while(true) {
			if(current["S/N"] == SN) //checking the SN value
				return current;
			if(current.next == null) //loop ending cond. had to put it at end so last node can be checked too
				break;
			current = current.next;
		}
		throw new Error(`${SN} dont exist in linkedlist`)
	}
	
	addItem(val) { //the val is vals array from ResultSystem, the SN shit is for the SN of the node before it
		let nodeBefore = this.getItem(SN++);
		let nodeAfterThatNode = nodeBefore.next;
		let nodeToAdd = new Node(val);
		nodeBefore.next = nodeToAdd;
		nodeToAdd.prev = nodeBefore;
		nodeToAdd.next = nodeAfterThatNode;
		if(nodeAfterThatNode) //exists
			nodeAfterThatNode.prev = nodeToAdd;
	}
	
	buildLine(arr) {
		/*
		This is responsible for building each line of the output
		the input arr must be arranger in the following order
		0 - S/N
		1 - Subject
		2 - C/A
		3 - Exam
		4 - Total
		5 - Grade
		*/
		let retString = ""; //return string
		
		for(let i = 0; i < arr.length; i++) {
			let allocWidth = Math.round((this.percentWidths.get(i)/100) * parseInt(winWidth));
			let actualWidth = String(arr[i]).length;
			let ans = allocWidth - actualWidth;
			if(ans <= 0)
				retString += arr[i];
			else {
				let leftPad, rightPad;
				if(i != 1 && i != 5) { //fields belonging to these indexes(1 and 5) are strings
					leftPad = ans;
					rightPad = 0;
				} else { //is a string ijn
					let pad = parseInt(ans/2);
					leftPad = pad + (ans % 2);
					rightPad = pad;
				}
				retString += " ".repeat(leftPad);
				retString += arr[i];
				retString += " ".repeat(rightPad);
			}
			retString += " ".repeat(1); //space width is 5
		}
		return retString;
	}
	
	display() {
		let retString = "";
		//displaying headers
		retString += this.buildLine(["S/N", "SUBJECT", "C/A", "EXAM", "TOTAL", "GRADE"]);
		retString += "\n";
		let curr = this.head.next || this.head;
		let total = 0, endSN; //for average calculation
		while(true){
			retString += this.buildLine([curr["S/N"], curr["Subject"], curr["C/A"], curr["Exam"], curr["Total"], curr["Grade"]]);
			retString += "\n";
			total += curr["Total"];
			endSN = curr["S/N"];
			if(curr.next == null)
				break;
			
			curr = curr.next;
		}
		//adding the overall total and average
		let totalString = `TOTAL - ${total}`;
		let avgString = `AVERAGE - ${(total / endSN).toPrecision(4)}`;
		retString += " ".repeat(winWidth - totalString.length) + totalString;
		retString += "\n";
		retString += " ".repeat(winWidth - avgString.length) + avgString;
		retString += "\n";
		
		return retString;
	}
	
	del(snArr) { //snArr is an array of S/Ns to identify nodes to be removed
		snArr.forEach((el, i) => snArr[i] = parseInt(el));
		//for the above, arr.map() dey fuck up
		let curr = this.head.next || this.head;
		while(true) {
			if(snArr.indexOf(curr["S/N"]) > -1) {
				curr.prev.next = curr.next;
				if(curr.next != null)
					curr.next.prev = curr.prev;
			}
			
			if(curr.next == null)
				break;
			
			curr = curr.next;
		}
		//next, resetting S/Ns
		curr = this.head.next || this.head;
		let newSN = 0;
		while(true) {
			curr["S/N"] = ++newSN;
			if(curr.next == null)
				break;
			
			curr = curr.next;
		}
		SN = newSN; //to fix that issue with using add command after delete command
	}
}

module.exports = LinkedList;