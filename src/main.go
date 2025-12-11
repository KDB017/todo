package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/lib/pq"
)

func main() {
	// 1. 接続情報を環境変数から取得する
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	host := os.Getenv("DB_HOST")   // ホスト名も環境変数から取得
	dbname := os.Getenv("DB_NAME") // データベース名も環境変数から取得

	// 環境変数が設定されていない場合のデフォルト値やエラーチェックを追加可能
	if user == "" || password == "" {
		log.Fatal("エラー: 環境変数 DB_USER および DB_PASSWORD が設定されていません。")
	}

	// 2. 接続文字列を環境変数を使って構築
	connStr := fmt.Sprintf(
		"user=%s password=%s host=%s port=5432 dbname=%s sslmode=disable",
		user, password, host, dbname,
	)

	// 3. データベース接続のオープン (以下、元のコードと同じ)
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal(err)
	}
	defer func() {
		if cerr := db.Close(); cerr != nil {
			log.Printf("データベースのクローズに失敗しました: %v", cerr)
		}
	}()

	// 4. 接続テスト
	err = db.Ping()
	if err != nil {
		log.Fatal("データベースへの接続に失敗しました: ", err)
	}

	fmt.Println("🎉 PostgreSQL への接続に成功しました！）")
}
