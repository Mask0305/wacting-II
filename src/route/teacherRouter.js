import express from "express";
import {teacherLogin} from "../controller/teacher/teacherLoginController";
import {isExamFinish, openExam} from "../controller/teacher/examController";
import {extendExam} from "../controller/teacher/examController";
import {closeExam} from "../controller/teacher/examController";
import {cheatPic} from "../controller/teacher/cheatpicController";
import {tTsConnection} from "../controller/teacher/examController";
import {examStudentList} from "../controller/teacher/examStudentListController";
import {examLog} from "../controller/teacher/examLogController";

const router = express.Router();

/** 老師登入 **/
router.post("/teacherLogin", teacherLogin);

/** 老師開啟考場 **/
router.post("/openExam", openExam);

/** 老師延長考試時間 **/
router.post("/extendExam", extendExam);

/** 老師關閉考試 **/
router.post("/closeExam", closeExam);

/** 老師接收作弊圖片 **/
router.post("/cheatPic", cheatPic);

/** 教師端與學生端確認連線狀況 **/
router.get("/tTsConnection", tTsConnection);

/** 教師確認學生進入狀況 **/
router.get("/examStudentList", examStudentList);

/** 教師取得作弊Log **/
router.get("/examLog", examLog);

/** 教師確認考試時間是否結束 **/
router.get("/isExamFinish", isExamFinish);

export default router;
