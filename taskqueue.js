
function taskQueue(){
	this.chain = [];
}

taskQueue.prototype = {

	//任务进队列
	in : function() {
		var tasks = Array.prototype.slice.call(arguments);
		for(var i in tasks) {
			if(tasks[i] instanceof Task)
				this.chain.push(tasks[i]);
		}
	},

	//任务出队列FIFO
	out : function() {
		var task = this.chain.shift();
		if(task instanceof Task) {
			 task.cb.apply(task.context, task.args);
		}
	},

	// 删除队列中指定位置的任务
	delete : function(i) {
		if(typeof i != 'Number' || i > this.chain.length) {
			throw 'index err';
		}
		this.chain.splice(i, 1);
	},

	//
	queue : function() {
		if(!this.chain[0] instanceof Task) {

			this.delete(0);
			this.queue();
		}

		if(this.chain[0].stats == 1) {
			this.out();
			this.queue();
		}

	}
}


function Task() {
	this.id = setTimeout('1');
	this.stats = 0;
	this.cb = function(){};
	this.context = this;
	this.args = [];
}


//test code
function cb1() {
	alert(1);
}

function cb2() {
	alert(2);
}

function cb3() {
	alert(3);
}

function cb4() {
	alert(4);
}

var taskqueue = new taskQueue();
var task1 = new Task(),task2 = new Task(), task3 = new Task(), task4 = new Task();
task1.cb = cb1; task2.cb = cb2; task3.cb = cb3; task4.cb = cb4;
taskqueue.in(task1, task2,task3, task4);

//用setTimeout()模拟异步事件
setTimeout(function() {
	task4.stats = 1;
	taskqueue.queue();
}, 1000);
setTimeout(function() {
	task2.stats = 1;
	taskqueue.queue();
}, 1000);
setTimeout(function() {
	task1.stats = 1;
	taskqueue.queue();
}, 1000);
setTimeout(function() {
	task3.stats = 1;
	taskqueue.queue();
}, 1000);
//最终输出应该是照入队顺序的1,2,3,4
