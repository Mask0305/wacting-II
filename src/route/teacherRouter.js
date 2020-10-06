import express from "express";
import { recordLsit } from "../controller/student/recordListController";
import { teacherLogin } from "../controller/teacher/teacherLoginController";
import { openExam } from "../controller/teacher/examController";
import { extendExam } from "../controller/teacher/extendExamController";
import { closeExam } from "../controller/teacher/closeExamController";
import { cheatpic } from "../controller/teacher/cheatpicController";
import { tTsConnection } from "../controller/teacher/tTsConnectionController";
import { examStudentList } from "../controller/teacher/examStudentListController";
import { examLog } from "../controller/teacher/examLogController";
const router = express.Router();

/** 老師登入 **/
router.post("/teacherLogin",teacherLogin);

/** 老師開啟考場 **/
router.post("/openExam",openExam);

/** 老師查看考試紀錄 **/
router.get("/recordList",recordLsit);

/** 老師延長考試時間 **/
router.put("/extendExam",extendExam);

/** 老師關閉考試 **/
router.put("/closeExam",closeExam);

/** 老師接收作弊圖片 **/
router.post("/cheatpic",cheatpic);

/** 教師端與學生端確認連線狀況 **/
router.get("/tTsConnection",tTsConnection);

/** 教師確認學生進入狀況 **/
router.get("/examStudentList",examStudentList);

/** 教師取得作弊Log **/
router.get("/examLog",examLog);


export default router;