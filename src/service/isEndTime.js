export const isEndTime = (now,examEndTime) =>{
	let endTime = examEndTime.substr(0,2)+examEndTime.substr(3,2);                    //取出時間部分轉化為數字進行比較
	let nowTime = now.substr(0,2)+now.substr(3,2);
	if(nowTime >= endTime){
		return true;
	}else{
		return false;
	}
};

