/**
 * インストール：
 * $ npm init -y
 * $ npm install -S node-redmine
 * $ npm install inbox
 * $ npm install mailparser
 * 
 * 実行：
 * $ node inbox2redmine.js
 * 
 * テストメール：
 * to: 「imap.gmail.com」で指定したメールアドレス
 * from: allow_fromで指定したメールアドレス
 * subject: redmineのタイトル
 */

const Redmine = require('node-redmine');
const inbox = require('inbox');
const simpleParser = require('mailparser').simpleParser;
const slack = require('./lib/slack.js');

//----------------------
var hostName = 'https://DOMAIN/redmine';  // Redmine の URL!!!!!!
var config = {
    apiKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxx' // <- API key!!!!!!
};
var redmine = new Redmine(hostName, config);

//----------------------
function escapeHtml(str) {
    str = str.replace(/&/g, '&amp;');
    str = str.replace(/</g, '&lt;');
    str = str.replace(/>/g, '&gt;');
    str = str.replace(/"/g, '&quot;');
    str = str.replace(/'/g, '&#39;');
    str = str.replace(/[\r\n]/g, '<br />');
    return str;
}

var imap = inbox.createConnection(
    false, 'imap.gmail.com', {
        secureConnection: true,
        auth: {
            user : "MAIL@ADDRESS",            // <-Gmailメールアドレス!!!!!!
            pass : "xxxxxxxxxxxxxxxxx"        // <-Gmail Password!!!!!!
        }
    }
);
imap.on('connect', function() {
    console.log('connected');
    imap.openMailbox('INBOX', function(error){
        if (error) throw error;
    });
});
imap.on('new', function(message) {
//    console.log(message);
    var from = message.from.address
    var stream = imap.createMessageStream(message.UID);
    simpleParser(stream)
        .then(mail => {
            // fromで判別する
            var allow_froms = ['MAIL@ADDRESS']; // <-メールするFromメールアドレス!!!!!!
            if (allow_froms.indexOf(from) === -1) { return; }

//            console.log(mail);
            // 登録する 各種IDの調整が必要!!!!!!
            redmine.create_issue({
                'issue': {
                    'project_id'    : 379,        // プロジェクト ID 「projects.xml?limit=100」へアクセス
                    'tracker_id'    : 6,          // トラッカー ID
                    'subject'       : escapeHtml(mail.subject),    // チケット名
                    'description'   : escapeHtml(mail.text),        // 説明 : 改行は「\r\n\」で書ける
                    'assigned_to_id': 4,            // 担当者 ID
                    'start_date'    : Date('Y-m-d)',  // 開始日 : 文字列 'YYYY-MM-DD'
                }
            }, function(error, ticket) {
                if (error) {
                    console.error('登録失敗 : ', error);
                    return ;
                }
//                console.log('投稿完了', ticket);
                // ついでにSlackになげる
                var id = ticket.issue.id;
                var link = hostName +'/'+ id;
                var slack_msg = "お問い合わせがありました。「"+ ticket.issue.subject +"」のチケット参照 <"+ link +">";
                slack.write(slack_msg);
            });
        })
        .catch(err => {
            console.log(err);
        });
});


imap.connect();
