var express = require('express');
var router = express.Router();
const cors = require('cors'); // corsミドルウェアを追加
require('dotenv').config();

// 接続情報を設定
const { MongoClient } = require("mongodb");
const uri = process.env.MONGODB_URI;

// 接続文字列が未定義の場合のエラーハンドリング
if (!uri) {
  throw new Error('MongoDB connection string is not defined in the environment variables');
}

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

router.use(cors());

router.get('/', async (req, res) => {
  try {
    // クライアントの接続を確認
    await client.connect();
    
    // データベース、コレクションを指定
    const database = client.db('notes');
    const notes = database.collection('notes');

    // idが1のドキュメントを取得
    const query = { id: 2 };
    const note = await notes.findOne(query);

    res.json(note);
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    res.status(500).send('Error connecting to MongoDB');
  } finally {
    // クライアントの接続を閉じる
    await client.close();
  }
});

module.exports = router;
