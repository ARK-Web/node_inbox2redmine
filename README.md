# node_inbox2redmine

Gmail(IMAP)を監視してredmineに通知を出す
====

詳細はアークウェブのブログをごらんください。

URL: https://xxxxxxxxxxxxxxxxxxxxx

### ざっくり説明
+ 1.A-Formのメール送信先をGmailにしておき、GmailのIMAPを有効にしておく

+ 2.このプログラムの!!!!!!の箇所をそれぞれ指定する
    * hostName : redmineのURL
    * apiKey : redmineのAPIキー
    * user : Gmailのメールアドレス
    * pass : Gmailのパスワード
    * allow_froms : A-Formに登録してメアド
    * issue.project_id : redmineのプロジェクトID
    * issue.tracker_id : redmineのトラッカーID
    * issue.assigned_to_id : redmineの担当者ID
    * lib/slack.jsのurl : slackのIncoming WebHooksのURL
+ 3.実行する

    node inbox2redmine.js


### 動作環境
* node.js v8.16.2
* npm ^6.13.2
* inbox ^1.1.59
* mailparser ^2.7.6
* node-redmine ^0.2.1

## Licence

MIT

## Author

[ark-web](https://github.com/ark-web)
