export const checkTime = (now, examEndTime, examStartTime) => {
	let endTime = examEndTime.substr(0, 2) + examEndTime.substr(3, 2);                    //取出時間部分轉化為數字進行比較
	let startTime = examStartTime.substr(0, 2) + examStartTime.substr(3, 2);
	let nowTime = now.substr(0, 2) + now.substr(3, 2);

	if (nowTime < startTime) {
		return "early";
	} else if (nowTime > endTime) {
		return "late";
	} else {
		return "";
	}
};
