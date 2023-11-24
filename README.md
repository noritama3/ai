<h1><p align="center"><img src="./ai.svg" alt="藍" height="200"></p></h1>
<p align="center">An Ai for Misskey. <a href="./torisetu.md">About Ai</a></p>

## これなに
Misskey用の日本語Bot藍のクローンです。
どせいすきーでリバーシをフックすると藍が即死するので reversi 自体を動かないようにしたものです。
## インストール
> Node.js と npm と MeCab (オプション) がインストールされている必要があります。
> Xserver VPS ではすでに node.js と npm はインストールされているので MeCab だけ追加でいれてください。
参考ページ https://dosei.fun/@noritama3/pages/1700805808849

まず適当なディレクトリに `git clone` します。
`config.json` を編集します。中身は次のようにします:
``` json
{
	"host": "https:// + あなたのインスタンスのURL (末尾の / は除く)",
	"i": "藍として動かしたいアカウントのアクセストークン",
	"master": "管理者のユーザー名(オプション)",
	"notingEnabled": "ランダムにノートを投稿する機能を無効にする場合は false を入れる",
	"keywordEnabled": "キーワードを覚える機能 (MeCab が必要) を有効にする場合は true を入れる (無効にする場合は false)",
	"keywordInterval": "キーワードを覚える間隔 (分, デフォルト60分)",
	"chartEnabled": "チャート機能を無効化する場合は false を入れてください",
	"serverMonitoring": "サーバー監視の機能を有効にする場合は true を入れる (無効にする場合は false)",
	"mecab": "MeCab のインストールパス (ソースからインストールした場合、大体は /usr/local/bin/mecab)",
	"mecabDic": "MeCab の辞書ファイルパス (オプション)",
	"mecabNeologd": "MeCabの辞書に mecab-ipadic-NEologd を使用している場合は true にすると良いかも"
}
```
カレントディレクトリに移動してから `yarn install` して `yarn build` して `yarn start` すれば起動できます

Dockerの場合は最初に `memory/memory.json` に空ファイルを作っておく必要があるらしいですが、どせいすきーは docker つかっていないのでわかりません。

Dockerイメージはここにあるそうです https://hub.docker.com/r/mei23/ia/

## フォント
一部の機能にはフォントが必要です。藍にはフォントは同梱されていないので、ご自身でフォントをインストールディレクトリに`font.ttf`という名前で設置してください。
フリーフォントで検索して好みのものをいれてください。

## 記憶
藍は記憶の保持にインメモリデータベースを使用しており、藍のインストールディレクトリに `memory.json` という名前で永続化されます。

## ライセンス
MIT

## Awards
<img src="./WorksOnMyMachine.png" alt="Works on my machine" height="120">
