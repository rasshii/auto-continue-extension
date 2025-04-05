// content_script.js

(function () {
  console.log(
    "Content script running (handles input, textarea, and contenteditable)..."
  );

  // --- 設定項目 (ここを対象のウェブページに合わせて変更) ---
  const searchText = "特定の文言"; // ページ内で探すテキスト
  const inputText = "続ける"; // 自動入力するテキスト
  const formSelector = "#your-form-id"; // 対象フォームのCSSセレクタ
  const inputSelector = "#your-input-id"; // 対象入力フィールド or contenteditable要素のCSSセレクタ
  const submitButtonSelector = "button[type='submit']"; // 送信ボタンのCSSセレクタ
  // ----------------------------------------------------------

  let visibleMatchingElements = []; // 画面内に表示されている、searchTextを含む要素を格納する配列
  let successfulInput = false; // テキスト入力が成功したかどうかのフラグ

  // 1. searchTextを含む可能性のある要素を効率的に探す
  const candidateSelector = "p, span, div, a, button, label"; // 検索対象とする要素タグ
  const elements = document.querySelectorAll(candidateSelector);

  elements.forEach((element) => {
    // 要素のテキスト内容にsearchTextが含まれているかチェック
    if (element.textContent && element.textContent.includes(searchText)) {
      const rect = element.getBoundingClientRect();

      // 要素がビューポート内に表示されているか判定
      const isVisible =
        rect.top < window.innerHeight &&
        rect.bottom > 0 &&
        rect.left < window.innerWidth &&
        rect.right > 0 &&
        window.getComputedStyle(element).display !== "none" &&
        window.getComputedStyle(element).visibility !== "hidden" &&
        window.getComputedStyle(element).opacity !== "0" &&
        rect.width > 0 &&
        rect.height > 0;

      if (isVisible) {
        visibleMatchingElements.push({ element: element, bottom: rect.bottom });
      }
    }
  });

  // 2. 画面内に表示されている要素の中から、最も下にあるものを特定
  if (visibleMatchingElements.length > 0) {
    visibleMatchingElements.sort((a, b) => b.bottom - a.bottom);
    const bottomMostElementData = visibleMatchingElements[0];
    const bottomMostElement = bottomMostElementData.element;

    console.log(
      `画面内で最も下にある "${searchText}" を含む表示要素を見つけました:`,
      bottomMostElement
    );

    // 3. 対象要素が見つかったので、指定されたセレクタで入力先要素を探し、テキスト入力処理を実行
    const inputElement = document.querySelector(inputSelector); // 入力対象の要素を取得

    if (!inputElement) {
      console.warn(
        `入力対象の要素 (${inputSelector}) が見つかりませんでした。`
      );
      return; // 入力先がない場合は処理終了
    }

    // 入力処理: input/textarea と contenteditable の両方に対応
    if (
      inputElement instanceof HTMLInputElement ||
      inputElement instanceof HTMLTextAreaElement
    ) {
      // input または textarea の場合の処理
      console.log(
        `入力フィールド (${inputSelector}) を見つけました。タイプ: Input/Textarea`
      );
      inputElement.value = inputText;
      // inputイベントを発火
      const event = new Event("input", { bubbles: true });
      inputElement.dispatchEvent(event);
      console.log(`"${inputText}" を入力しました。`);
      successfulInput = true; // 入力成功
    } else if (inputElement.isContentEditable) {
      // contenteditable な要素 (divなど) の場合の処理
      console.log(`contenteditable要素 (${inputSelector}) を見つけました。`);
      inputElement.textContent = inputText; // textContent でテキストを設定
      // 必要であれば、inputやblurなどのイベントを発火させる（サイトの作りによる）
      // contenteditableの場合もinputイベントが使われることが多い
      const event = new Event("input", { bubbles: true });
      inputElement.dispatchEvent(event);
      console.log(`"${inputText}" を contenteditable 要素に入力しました。`);
      successfulInput = true; // 入力成功
    } else {
      // どちらでもない場合
      console.warn(
        `入力可能な要素 (${inputSelector}) が見つからないか、対応していない要素タイプです。`
      );
      // 送信処理に進まないように、ここで処理を中断
      return;
    }

    // 4. テキスト入力が成功した場合のみ、送信ボタンを探してクリック
    if (successfulInput) {
      const formElement = document.querySelector(formSelector); // フォーム要素を取得 (ボタン検索のため)
      const submitButtonElement = formElement
        ? formElement.querySelector(submitButtonSelector)
        : document.querySelector(submitButtonSelector); // フォーム内 or 全体からボタン検索

      if (submitButtonElement && submitButtonElement instanceof HTMLElement) {
        console.log(`送信ボタン (${submitButtonSelector}) を見つけました。`);
        // ボタンをクリックして送信 (少し遅延を入れる)
        setTimeout(() => {
          submitButtonElement.click();
          console.log("送信ボタンをクリックしました。");
        }, 100); // 100ミリ秒待機
      } else {
        console.warn(
          `送信ボタン (${submitButtonSelector}) が見つかりませんでした。`
        );
      }
    }
  } else {
    console.log(
      `画面内に "${searchText}" を含む表示要素は見つかりませんでした。`
    );
  }
})();
