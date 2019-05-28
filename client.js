var gSpeed = 1000;
var gStackA = [];
var gStackB = [];
var gStackASaved = [];
var gOps = [];
var gOpsDone = [];
var gStackLenMax = 0;
var gStackAmbitus = 0;
var gStackMin = 0;
var gStackMax = 0;
var gClockHandler = function(){ setTimeout(clock, gSpeed) };

function push(dst, src, stackId){
    if (src.length < 1)
        return ([]);
    var buf = src.shift();
    src.splice();
    dst.unshift(buf);
    if (stackId == 'a' || stackId == 'b')
        return([{stackId: stackId, position: 0, value: dst[0]}])
}

function swap(stack, stackId){
    if (stack.length < 2)
        return ([]);
    var buf = stack[0];
    stack[0] = stack[1]
    stack[1] = buf;
    return([{stackId: stackId, position: 0, value: stack[0]},
            {stackId: stackId, position: 1, value: stack[1]}])
}

function reverse(stack, stackId){
    if (stack.length < 2)
        return ([]);
    stack.unshift(stack.pop());
    return([{stackId: stackId, position: 0, value: stack[0]}])
}

function rotate(stack, stackId){
    if (stack.length < 2)
        return ([]);
    stack.push(stack.shift());
    position = stack.length - 1;
    return([{stackId: stackId, position: position, value: stack[position]}])
}

function clock(){
	const radioSpeed = document.getElementsByClassName("input-speed");
    let i = 0;
    while (i < radioSpeed.length){
		if (radioSpeed[i].checked)
			value = radioSpeed[i].value;
        i += 1;
    }
    if (value < 0)
        processOpList(gOps, gOpsDone, "opsDone")         
    else
        processOpList(gOpsDone, gOps, "ops");
    gClockHandler = setTimeout(clock, gSpeed);
}

function processOpList(dst, src, opId){
    if (src.length && src[0].length){
        var op = src[0];
        if (opId == "opsDone")
        {
            if (src[0] == "pa")
                op = "pb";
            if (src[0] == "pb")
                op = "pa"
            if (src[0] == "ra")
                op = "rra";
            if (src[0] == "rb")
                op = "rrb";
            if (src[0] == "rr")
                op = "rrr";
            if (src[0] == "rra")
                op = "ra";
            if (src[0] == "rrb")
                op = "rb";
            if (src[0] == "rrr")
                op = "rr"
        }
        doOp(op);
        var radio = document.getElementById(op);
		radio.checked = true;
		push(dst, src, "ops");
		var currentOp = document.getElementsByClassName("op-selected");
		if (currentOp.length)
			currentOp[0].className = "";
		var opList = document.getElementById('output-op');
		currentOp = opList.getElementsByTagName("li")[gOpsDone.length - 1];
		if (gOpsDone.length){
			currentOp.className = "op-selected";
			var position = currentOp.offsetTop;
			opList.scrollTop = position - (opList.offsetHeight * 3.5);
		}
	}
}

function highligth(elements){
    var canvasElement  = document.getElementById('canvas');
    var surface = canvasElement.getContext('2d');
    var height = canvasElement.height / gStackLenMax;
    var steps = canvasElement.width / 2 / gStackLenMax;
    var i = 0;
    var shift = 0;
    while (i < elements.length){
        if (elements[i]['stackId'] == 'b')
            shift = canvas.width / 2;
        var width = (elements[i]['value'] + 1) * steps;
        surface.fillStyle = "cyan";
        surface.fillRect(0 + shift, elements[i]['position'] * height, width, height);
        i += 1;
    }
}

function radioOpListen(){
    const radios = document.form.op;
    let i = 0;
    while (i < radios.length){
        radios[i].addEventListener("click", function(){
            doOp(this.value);
        });
        i += 1;
    }
}

function doOp(value)
{
    var operations = {
        pa: function(){ return (push(gStackA, gStackB, 'a')) },
        pb: function(){ return (push(gStackB, gStackA, 'b')) },
        sa: function(){ return (swap(gStackA, 'a')) },
        sb: function(){ return (swap(gStackB, 'b')) },
        ss: function(){ return (swap(gStackA, 'a').concat(swap(gStackB, 'b'))) },
        ra: function(){ return (rotate(gStackA, 'a')) },
        rb: function(){ return (rotate(gStackB, 'b')) },
        rr: function(){ return (rotate(gStackA, 'a').concat(rotate(gStackB, 'b'))) },
        rra: function(){ return (reverse(gStackA, 'a'))},
        rrb: function(){ return (reverse(gStackB, 'b'))},
        rrr: function(){ return (reverse(gStackA, 'a').concat(reverse(gStackB, 'b'))) }
    };
    var opsSelected = operations[value];
    var modifs = opsSelected();
    updateCanvas();
    highligth(modifs);
}

function createList(len){
	gStackASaved = [];
    gStackA = [];
	gStackB = [];
	gOps = [];
	gOpsDone = [];
	gStackLenMax = len;
	var outputList = document.getElementById("output-op");
	var result = document.getElementById("len-result");
	result.textContent = "0";
	while (outputList.firstChild) {
    	outputList.removeChild(outputList.firstChild);
	}
    var i = 0;
    while (i < len){
        gStackA[i] = i;
        i += 1;
    }
    i = 0;
    while (i < len){
        var randIndex = Math.floor(Math.random() * (i + 1));
        var buf = gStackA[i];
        gStackA[i] = gStackA[randIndex];
        gStackA[randIndex] = buf;
        i += 1;
	}
	setAmbitus(gStackA);
    gStackASaved = gStackA.slice();
}

function printStack(id, stack, surface, canvas){
    var len = stack.length;
    var shift = 0;
    var i = 0;
    if (id == 'B')
        shift = canvas.width / 2;
    if (len){
		var height = canvas.height / gStackLenMax;
        var maxWidth = canvas.width / 2;
       // var steps = canvas.width / 2 / gStackLenMax;
        while (i < len){
         // 	var width = (stack[i] + 1) * steps;
		 	var width = stack[i] - (gStackMin * 2);
			width = width * maxWidth / gStackAmbitus;
            surface.fillStyle = "gold";
            surface.fillRect(0 + shift, i * height, width, height);
            i += 1;
        }  
    }
}

function updateCanvas(){
    var canvasElement  = document.getElementById('canvas');
    var surface = canvasElement.getContext('2d');
    surface.clearRect(0, 0, canvasElement.width, canvasElement.height);
    printStack('A', gStackA, surface, canvasElement);
    printStack('B', gStackB, surface, canvasElement);
}

function updateListLength(e){
    if (e.currentTarget.value < 2 || e.currentTarget.value > 1000){
        document.getElementById("input-check").disabled = true;
        return (false);
	}
	document.getElementById("input-reverse").disabled = false;
    document.getElementById("input-check").disabled = false;
    createList(e.currentTarget.value);
    updateCanvas();
}

function updateSpeed(value){
    clearTimeout(gClockHandler);
    if (value < 0)
        value *= -1;
    if (value == 1)
        gSpeed = 1000;
    if (value == 2)
        gSpeed = 300;
    if (value == 3)
        gSpeed = 25; 
    if (value != 0)
        clock();
}

function addOutputList(op, target)
{
	if (op.length){
	    var nLi = document.createElement("li");
	    nLi.appendChild(document.createTextNode(op));
	    target.appendChild(nLi);
	    var result = document.getElementById("len-result")
	    result.textContent = target.childNodes.length;
	}
}

function setCanvasDimensions(){
	var canvas = document.getElementById("canvas");
    var interface = document.getElementById("interface");
    canvas.width = document.documentElement.clientWidth - interface.offsetWidth;
    canvas.height = document.documentElement.clientHeight;
}

function sortNumber(a, b){
	return a - b;
}

function ctrSpeedListen(){
	const ctrSpeed = document.getElementsByClassName("ctr-speed");
    let i = 0;
    while (i < ctrSpeed.length){
        ctrSpeed[i].addEventListener("click", function(e){
            e.preventDefault();
			var ctr = this.getAttribute("id");
			var targetId = "radio-" + ctr.substring(ctr.lastIndexOf("-") + 1);
			var target = document.getElementById(targetId)
			target.checked = true;
			updateSpeed(target.value);
        });
        i += 1;
    }
}

function radioSpeedListen(){
	const inputSpeed = document.getElementsByClassName("input-speed");
    let i = 0;
    while (i < inputSpeed.length){
        inputSpeed[i].addEventListener("click", function(e){
			updateSpeed(this.value);
        });
        i += 1;
    }
}

function setAmbitus(array){
	var max = -2147483648;
	var min = 2147483647;
	var len = array.length;
	var i = 0;
	while (i < len){
		if (array[i] > max)
			max = array[i];
		if (array[i] < min)
			min = array[i];
		i += 1;
	}
	if (min == 0)
		min = -1 * max / (array.length - 1);
	gStackMin = min;
	gStackMax = max;
	gStackAmbitus = max - (min * 2);
}

function listenInterfaceEvents(){
    const inputImport = document.getElementById("input-import");
	inputImport.addEventListener("click", function(e){
		var list = prompt("Enter a space separated integers suit", "1 59 48 -100");
		list = list.split(" ");
		/*check input */
		var outputList = document.getElementById("output-op");
		var result = document.getElementById("len-result");
		result.textContent = "0";
		while (outputList.firstChild) {
    		outputList.removeChild(outputList.firstChild);
		}
		document.getElementById("input-reverse").disabled = false;
    	document.getElementById("input-check").disabled = false;
		gStackASaved = [];
    	gStackA = list.slice();
    	gStackASaved = gStackA.slice();
		gStackB = [];
		gOps = [];
		gOpsDone = [];
		gStackLenMax = gStackA.length;
		setAmbitus(gStackA);
    	updateCanvas();
	});
    const inputLen = document.getElementById("input-len");
    inputLen.addEventListener("change", updateListLength, false);
    inputLen.addEventListener("click", updateListLength, false);
    createList(inputLen.value);
	setCanvasDimensions();
    updateCanvas();
	ctrSpeedListen();
	radioSpeedListen();
    radioOpListen();
    const inputReverse = document.getElementById("input-reverse");
    inputReverse.addEventListener("click", function(){
		gStackA = gStackASaved.slice();
		gStackB = [];
		gStackA.sort(sortNumber);
		gStackA.reverse();
		updateCanvas();
	});
	window.addEventListener('resize', function(){
		setCanvasDimensions();
		updateCanvas();
	}, true);
}

document.addEventListener("DOMContentLoaded", function(){
	listenInterfaceEvents();
	clock();
    var socket = io('http://localhost:8080');
    const inputCheck = document.getElementById("input-check");
    inputCheck.addEventListener("click", function(){
		socket.emit("run", gStackA);
		document.getElementById("input-check").disabled = true;
		document.getElementById("input-reverse").disabled = true;
		document.getElementById("layout").style.display = 'block';
    });
    socket.on("message", function(data){
        alert(data); 
    });
    var target = document.getElementById("output-op");
    socket.on("newop", function(data){
		document.getElementById("layout").style.display = 'none';
        gOps.push(data);
        addOutputList(data, target);
	});
});
