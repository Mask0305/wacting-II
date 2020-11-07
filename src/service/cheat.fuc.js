import { post_cheatpic } from "../service/initiative_post";
import { imgToBase } from "../service/base64_image";

export const cheatfuc = (imgs,studentName,studentId,cheatTime,cheatProbability) => {

	var base64str = [imgToBase(imgs[0]),imgToBase(imgs[1]),imgToBase(imgs[2])];
        
	var request = {
		"studentId": studentId,
		"studentName": studentName,
		"cheatTime": cheatTime,
		"cheatProbability": cheatProbability,
		"cheatImages": [
			base64str[0],
			base64str[1],
			base64str[2]
		] 
	};
	post_cheatpic(request);

};

// imgs=["1.jpg","2.jpg","3.jpg"];
// cheatfuc(imgs,"童泓賢","1310834023","01：26","85%");

/*  傳圖片
var base64str = base_img.imgtobase('joker.jpg');
for(i=1;i<=100;i++){
    var reqdata={
        "basecode":base64str,
        "student":"謝隆傑"+i
    }
    
    connect.post_cheatpic(reqdata);
}

*/
