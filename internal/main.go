// main.go

package main

import (
	"log"

	"github.com/KDB017/todo/internal/db"
)

func main() {
	// 1. データベース接続を確立
	log.Println("データベース接続中...")
	dbConn := db.ConnectDB()
	defer dbConn.Close()
	log.Println("接続成功！")

	// 2. テーブルを作成
	db.CreateTables(dbConn)

	log.Println("🎉 アプリケーションの初期設定（テーブル作成）が完了しました。")
}
