// content_script.js

(function () {
  console.log("Content script running...");

  // --- 設定項目 (ここを対象のウェブページに合わせて変更) ---
  const searchText = "チャットを継続できます"; // ページ内で探すテキスト（例: "チャットを継続できます", "同意して次へ" など）
  const inputText = "続ける"; // 自動入力するテキスト
  const formSelector = "#your-form-id"; // 対象フォームのCSSセレクタ (例: "form", "#entry-form", ".main-form")
  const inputSelector = "#your-input-id"; // 対象入力フィールドのCSSセレクタ (例: "input[name='continue_flag']", "#confirm-input")
  const submitButtonSelector = "button[type='submit']"; // 送信ボタンのCSSセレクタ (例: "#submit-btn", ".next-button")
  // ----------------------------------------------------------

  // ページ内のテキスト全体をチェック (もっと限定的な要素を探す方が確実な場合もあります)
  if (document.body.innerText.includes(searchText)) {
    console.log(`"${searchText}" を検出しました。`);

    // 対象のフォーム要素、入力フィールド、送信ボタンを取得
    const formElement = document.querySelector(formSelector);
    const inputElement = document.querySelector(inputSelector);
    // フォーム内の送信ボタンを探す方がより安全な場合も
    const submitButtonElement = formElement
      ? formElement.querySelector(submitButtonSelector)
      : document.querySelector(submitButtonSelector);

    // 入力フィールドが存在するかチェック
    if (
      inputElement &&
      (inputElement instanceof HTMLInputElement ||
        inputElement instanceof HTMLTextAreaElement)
    ) {
      console.log(`入力フィールド (${inputSelector}) を見つけました。`);
      // 値を入力
      inputElement.value = inputText;

      // Reactなどのフレームワーク用にinputイベントを発火させる（必要な場合）
      const event = new Event("input", { bubbles: true });
      inputElement.dispatchEvent(event);

      console.log(`"${inputText}" を入力しました。`);

      // 送信ボタンが存在するかチェックしてクリック
      if (submitButtonElement && submitButtonElement instanceof HTMLElement) {
        console.log(`送信ボタン (${submitButtonSelector}) を見つけました。`);
        submitButtonElement.click(); // ボタンをクリックして送信
        console.log("送信ボタンをクリックしました。");
      }
      // 送信ボタンが見つからないが、フォーム要素がある場合、フォーム自体を送信 (非推奨: ボタンのクリックが望ましい)
      // else if (formElement && formElement instanceof HTMLFormElement) {
      //   console.log(`フォーム (${formSelector}) を見つけました。送信ボタンは見つかりませんでしたが、フォームをsubmitします。`);
      //   formElement.submit();
      // }
      else {
        console.warn("送信ボタンが見つかりませんでした。");
      }
    } else {
      console.warn(
        `入力フィールド (${inputSelector}) が見つからないか、不正な要素です。`
      );
    }
  } else {
    console.log(`"${searchText}" はページ内に見つかりませんでした。`);
  }
})(); // 即時実行関数で囲むことでグローバルスコープの汚染を防ぐ
