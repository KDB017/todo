FROM postgres:14

# PostgreSQLのロケールとタイムゾーン設定に必要なパッケージのインストール
# LANGとLC_ALLを適用するため、localesパッケージをインストール
RUN localedef -i ja_JP -f UTF-8 ja_JP.UTF-8
RUN apt-get update && apt-get install -y locales && rm -rf /var/lib/apt/lists/*

# Time Zoneの設定
ENV TZ Asia/Tokyo

# 言語環境の設定（PostgreSQLコンテナ内のロケール設定を更新）
ENV LANG ja_JP.UTF-8
ENV LANGUAGE ja_JP:ja
ENV LC_ALL ja_JP.UTF-8

# DBの初期化（初期DB作成時にこれらの環境変数が使われる）