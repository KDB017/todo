// internal/db/migrations.go

package db

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/lib/pq"
)

// ConnectDB は、環境変数から接続情報を取得し、DB接続を確立して返します。
func ConnectDB() *sql.DB {
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	host := os.Getenv("DB_HOST")
	dbname := os.Getenv("DB_NAME")

	if user == "" || password == "" || host == "" || dbname == "" {
		log.Fatal("エラー: データベース接続に必要な環境変数が不足しています (DB_USER, DB_PASSWORD, DB_HOST, DB_NAME)")
	}

	connStr := fmt.Sprintf(
		"user=%s password=%s host=%s port=5432 dbname=%s sslmode=disable",
		user, password, host, dbname,
	)

	db, err := sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("sql.Openエラー: ", err)
	}

	if err = db.Ping(); err != nil {
		log.Fatal("データベースへの接続に失敗しました: ", err)
	}

	return db
}

// CreateTables は、usersとtodosテーブルを作成します。
func CreateTables(db *sql.DB) {
	// ユーザーテーブルの作成SQL (認証情報を含む)
	const usersTableQuery = `
	CREATE TABLE IF NOT EXISTS users (
		id SERIAL PRIMARY KEY,
		username VARCHAR(50) UNIQUE NOT NULL,
		hashed_password VARCHAR(100) NOT NULL,
		created_at TIMESTAMP NOT NULL DEFAULT NOW()
	)`

	// ToDoテーブルの作成SQL (usersテーブルへの外部キーを含む)
	const todosTableQuery = `
	CREATE TABLE IF NOT EXISTS todos (
		id SERIAL PRIMARY KEY,
		user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
		text TEXT NOT NULL,
		is_completed BOOLEAN NOT NULL DEFAULT FALSE,
		created_at TIMESTAMP NOT NULL DEFAULT NOW()
	)`

	// 1. users テーブルの作成
	if _, err := db.Exec(usersTableQuery); err != nil {
		log.Fatal("usersテーブル作成に失敗しました: ", err)
	}
	log.Println("✅ users テーブル作成完了。")

	// 2. todos テーブルの作成
	if _, err := db.Exec(todosTableQuery); err != nil {
		log.Fatal("todosテーブル作成に失敗しました: ", err)
	}
	log.Println("✅ todos テーブル作成完了 (user_id 外部キー設定済み)。")
}
