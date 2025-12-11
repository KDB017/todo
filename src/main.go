package main

import (
	"database/sql"
	"fmt"
	"log"

	// PostgreSQLドライバをインポート (コード内では直接使わないが、db.Openの裏側で必要)
	_ "github.com/lib/pq"
)

func main() {
	// 1. 接続文字列 (あなたが定義した電話番号とパスワード)
	connStr := "user=user password=password host=localhost port=5432 dbname=todo_app sslmode=disable"
    
	// 2. データベース接続のオープン
	// sql.Open は、接続を確立するのではなく、ドライバを初期化するだけである点に注意
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		// 接続設定に誤りがある場合にエラーが発生
		log.Fatal(err)
	}
	// main関数が終わる前にDB接続を閉じる (リソース管理のベストプラクティス)
	defer db.Close() 

	// 3. 接続テスト
	// Pingは、実際にDBサーバーとの間で通信を行い、接続を確立する
	err = db.Ping()
	if err != nil {
		// DBが起動していない、認証情報が間違っている場合にエラーが発生
		log.Fatal("データベースへの接続に失敗しました: ", err)
	}

	fmt.Println("🎉 PostgreSQL への接続に成功しました！")
}