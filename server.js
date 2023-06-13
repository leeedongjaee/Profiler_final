const express = require("express");
const multer = require("multer");
const mysql = require("mysql2");
const fs = require("fs");
const { getDataFromRawData } = require("./libs/parsing");
const { calcPerformance } = require("./libs/calculate");

const app = express();
const upload = multer({ dest: "uploads/" });

// MySQL 연결 설정
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "teamproject",
});

// 파일 업로드 및 원본 데이터 저장
app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    res.status(400).send("No file uploaded");
    return;
  }

  // 요청의 고유 ID 생성
  const requestId = `${Date.now()}`;

  // 파일에서 데이터 읽기
  const rawData = fs.readFileSync(req.file.path, "utf8");
  const parsedData = getDataFromRawData(rawData);

  // 원본 데이터 저장
  const insertQuery = `INSERT INTO performance_data (core, task, value, request_id) VALUES ?`;
  const insertPayload = parsedData.map(({ core, task, value }) => [
    core,
    task,
    value,
    requestId,
  ]);
  await connection.promise().query(insertQuery, [insertPayload]);

  // 결과 페이지로 Redirection
  res.redirect(`/result.html?requestId=${requestId}`);
});

// 결과 페이지
app.get("/result/:requestId", async (req, res) => {
  const { requestId } = req.params;

  // 원본 데이터 조회
  const selectQuery = `SELECT core, task, value FROM performance_data WHERE request_id = ?`;
  const [rows] = await connection.promise().query(selectQuery, [requestId]);

  // 각 집단 별 평균, 최대, 최소 값 계산
  const groups = {
    byCore: {
      core1: calcPerformance(rows, "core", "core1", "task"),
      core2: calcPerformance(rows, "core", "core2", "task"),
      core3: calcPerformance(rows, "core", "core3", "task"),
      core4: calcPerformance(rows, "core", "core4", "task"),
      core5: calcPerformance(rows, "core", "core5", "task"),
    },
    byTask: {
      task1: calcPerformance(rows, "task", "task1", "core"),
      task2: calcPerformance(rows, "task", "task2", "core"),
      task3: calcPerformance(rows, "task", "task3", "core"),
      task4: calcPerformance(rows, "task", "task4", "core"),
      task5: calcPerformance(rows, "task", "task5", "core"),
    },
  };

  res.json(groups);
});

app.use(express.static("public"));

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
