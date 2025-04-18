# 自動テキスト入力＆送信 Chrome拡張機能

## 概要

このChrome拡張機能は、現在表示しているウェブページの**画面表示領域（ビューポート）内において、最も下部に表示されている特定のテキスト**（例: 「チャットを継続できます」）を検出し、ページ内で**最初に見つかった編集可能な要素（`contenteditable`属性を持つ要素）**に、指定されたテキスト（例: 「続ける」）を自動で入力し、その後、指定された送信ボタンをクリックします。

特定の状況下での繰り返し操作（警告メッセージ後の継続入力など）を自動化することを目的としています。

## 機能

* ツールバーの拡張機能アイコンをクリックすることで起動します。
* アクティブなタブの画面表示領域（ビューポート）をスキャンし、事前に設定された特定の文言 (`searchText`) を含む要素の中から、**最も下部に表示されているもの**を探します。
* 最も下部にある対象の文言が見つかった場合、ページ内で**最初に見つかった `contenteditable` 属性を持つ要素**に、指定されたテキスト (`inputText`) を入力します。
* テキスト入力後、設定されたCSSセレクタに一致する送信ボタン (`submitButtonSelector`) をクリックします。

## インストール方法

この拡張機能はChromeウェブストアには公開されていません。以下の手順で手動でインストールしてください。

1. **ソースコードの入手:**
    * このリポジトリをクローンするか、ZIPファイルをダウンロードして解凍します。
2. **Chrome拡張機能管理ページを開く:**
    * Chromeブラウザのアドレスバーに `chrome://extensions` と入力してEnterキーを押します。
3. **デベロッパーモードを有効にする:**
    * ページの右上にある「デベロッパーモード」のスイッチをオンにします。
4. **拡張機能を読み込む:**
    * 「パッケージ化されていない拡張機能を読み込む」ボタンをクリックします。
    * ファイル選択ダイアログが表示されるので、手順1で入手したソースコードのフォルダ（`manifest.json` ファイルが含まれているフォルダ）を選択します。
5. **インストール完了:**
    * 拡張機能のリストに「自動テキスト入力＆送信 Chrome拡張機能」（または `manifest.json` で設定した名前）が表示されればインストール完了です。ツールバーにアイコンが表示されます。

## 設定方法 (重要)

この拡張機能が意図通りに動作するためには、いくつかの設定を対象のウェブページに合わせて調整する必要があります。

1. インストールした拡張機能のソースコードフォルダ内にある `content_script.js` ファイルをテキストエディタで開きます。
2. ファイルの先頭付近にある以下の設定項目を変更します。

    ```javascript
    // --- 設定項目 (ここを対象のウェブページに合わせて変更) ---
    const searchText = "チャットを継続できます"; // ページ内で探すテキスト
    const inputText = "続ける";                 // 自動入力するテキスト
    // inputSelectorは contenteditable 要素を対象とするように固定されています
    // const inputSelector = "[contenteditable]"; // 通常、変更不要
    const submitButtonSelector = 'button[aria-label="メッセージを送信"]'; // 送信ボタンのCSSセレクタ
    // ----------------------------------------------------------
    ```

    * `searchText`: ページ上でこの拡張機能のトリガー（きっかけ）としたいテキストに正確に書き換えます。
    * `inputText`: 自動入力させたいテキストに書き換えます。
    * `submitButtonSelector`: クリックさせたい送信ボタンを特定するための **CSSセレクタ** を設定します。
        * 対象のウェブページを開き、Chromeのデベロッパーツール（要素を右クリック -> 検証）を使用して、クリックしたい送信ボタンの **CSSセレクタ** を調べます。
        * `id` 属性 (`#your-id`)、`class` 属性 (`.your-class`)、`aria-label` 属性 (`button[aria-label="ラベル名"]`)、カスタムデータ属性 (`[data-testid="your-id"]`) などを利用して、要素を一意に特定できるセレクタを指定してください。**クラス名は変更されやすいため、他の属性（`aria-label` や `id`、`data-*`）を使うのがより推奨されます。**

3. `inputSelector` はコード内で `"[contenteditable]"` に固定されています。これは、ページ上で最初に見つかる編集可能な要素（リッチテキストエディタの入力エリアなど、`contenteditable="true"` が設定された要素）を対象とします。もし対象ページでこれが適切でない場合は、この行のコメントアウトを解除し、適切なセレクタに変更する必要がありますが、通常はこのままで動作することが期待されます。
4. ファイルを保存します。
5. Chromeの拡張機能管理ページ (`chrome://extensions`) で、この拡張機能の「更新」ボタン（リロードアイコン）をクリックして変更を反映させます。

## 使い方

1. 設定で指定した `searchText` が表示される可能性のあるウェブページを開きます。
2. ツールバーに追加されたこの拡張機能のアイコンをクリックします。
3. ページ内に該当の文言が表示されており、かつそれが現在の画面表示領域で最も下にある場合に、自動的にページ内の最初の編集可能領域 (`[contenteditable]`) に `inputText` が入力され、その後 `submitButtonSelector` で指定された送信ボタンがクリックされます。
    * 動作状況は、デベロッパーツール（F12キー）の「Console」タブで確認できます。

## 注意点

* <ins>**対象サイトの利用規約 (ToS) 違反の可能性:**</ins> **多くのウェブサイトでは、利用規約により自動化ツール（ボット、スクリプト等）による操作が明確に禁止されています。この拡張機能を使用する前に、対象となるウェブサイトの利用規約を必ず確認し、規約に違反しないことを確かめてください。規約違反が発覚した場合、アカウントの停止や法的措置などの対象となる可能性があります。**
* <ins>**悪用厳禁:**</ins> **この拡張機能を、スパム行為、不正な利益の獲得（チケットや限定商品の買い占めなど）、他者への迷惑行為、ウェブサイトへの過負荷、その他利用規約に反する目的で使用しないでください。**
* **自己責任での利用:** 自動操作は意図しない結果（誤送信など）を招く可能性があります。この拡張機能の使用は**自己責任**で行ってください。開発者は本拡張機能の使用によって生じたいかなる損害についても責任を負いません。
* 入力対象: この拡張機能は、ページ内で **最初に見つかった `contenteditable` 属性を持つ要素** にテキストを入力します。もしページ内に複数の編集可能要素がある場合、意図しない要素に入力される可能性があります。
* 動作条件: 画面に表示されている範囲で特定の文言を探します。ページ内に文言が存在しても、スクロールしないと見えない場所にある場合は反応しません。
* セレクタの正確性: 対象ウェブサイトのHTML構造に強く依存します。特に `submitButtonSelector` は正確に指定する必要があります。ウェブサイトのデザインや構造が変更されると、セレクタが機能しなくなり、拡張機能が動作しなくなる可能性があります。その場合は、再度セレクタを調べて設定を更新する必要があります。
* 可視性判定: 要素が画面に表示されているかの判定は、スタイルや要素のサイズを考慮していますが、完全ではありません。複雑なレイアウトのサイトでは意図通りに動作しない可能性があります。
* 動作保証: すべてのウェブサイトやフォームで動作することを保証するものではありません。

## ライセンス

[MIT License](LICENSE.txt)

---

開発者: yuki igarashi
連絡先: <https://github.com/rasshii>
