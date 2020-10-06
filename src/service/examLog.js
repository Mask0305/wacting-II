

var studentLog = new Array();
export const stuLog = (studentId,studentName,time,probability) => {
	studentLog.unshift({        //最新的會在第一筆
		"studentId":studentId,
		"studentName":studentName,
		"time":time,
		"probability":probability,
		"cheatImages": [
			studentId+"_"+time+"_"+1+".jpg",
			studentId+"_"+time+"_"+2+".jpg",
			studentId+"_"+time+"_"+3+".jpg",
		] 
	});
};
