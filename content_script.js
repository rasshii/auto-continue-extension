// content_script.js

(function () {
  console.log("Content script running (find bottom-most visible text)...");

  // --- 設定項目 (ここを対象のウェブページに合わせて変更) ---
  const searchText = "特定の文言"; // ページ内で探すテキスト
  const inputText = "続ける"; // 自動入力するテキスト
  const formSelector = ".contenteditable"; // 対象フォームのCSSセレクタ
  const inputSelector = ".data-placeholder"; // 対象入力フィールドのCSSセレクタ
  const submitButtonSelector = "button[type='button']"; // 送信ボタンのCSSセレクタ
  // ----------------------------------------------------------

  let visibleMatchingElements = []; // 画面内に表示されている、searchTextを含む要素を格納する配列

  // 1. searchTextを含む可能性のある要素を効率的に探す (特定のタグに絞る例)
  //    より広範囲を探したい場合は 'div, p, span, a, button, li, td, h1, h2, h3, h4, h5, h6' など調整
  const candidateSelector = "p, span, div, a, button, label"; // 検索対象とする要素タグ
  const elements = document.querySelectorAll(candidateSelector);

  elements.forEach((element) => {
    // 要素のテキスト内容にsearchTextが含まれているかチェック
    if (element.textContent && element.textContent.includes(searchText)) {
      const rect = element.getBoundingClientRect();

      // 要素がビューポート内に表示されているか判定
      const isVisible =
        rect.top < window.innerHeight && // 上端がビューポートの下端より上
        rect.bottom > 0 && // 下端がビューポートの上端より下
        rect.left < window.innerWidth && // 左端がビューポートの右端より左
        rect.right > 0 && // 右端がビューポートの左端より右
        // スタイルで非表示になっていないか簡易チェック
        window.getComputedStyle(element).display !== "none" &&
        window.getComputedStyle(element).visibility !== "hidden" &&
        window.getComputedStyle(element).opacity !== "0" &&
        rect.width > 0 && // 幅があるか
        rect.height > 0; // 高さがあるか

      if (isVisible) {
        // 表示されていれば、要素とその下端位置(bottom)を配列に追加
        visibleMatchingElements.push({ element: element, bottom: rect.bottom });
      }
    }
  });

  // 2. 画面内に表示されている要素の中から、最も下にあるものを特定
  if (visibleMatchingElements.length > 0) {
    // bottom座標（画面の上からの距離）が最も大きい要素を選ぶ（降順ソートして最初の要素）
    visibleMatchingElements.sort((a, b) => b.bottom - a.bottom);
    const bottomMostElementData = visibleMatchingElements[0];
    const bottomMostElement = bottomMostElementData.element;

    console.log(
      `画面内で最も下にある "${searchText}" を含む表示要素を見つけました:`,
      bottomMostElement
    );
    console.log(`要素の下端位置 (bottom): ${bottomMostElementData.bottom}`);

    // 3. 対象要素が見つかったので、フォーム操作を実行
    // --- ここから元のフォーム操作ロジック ---
    const formElement = document.querySelector(formSelector);
    const inputElement = document.querySelector(inputSelector);
    const submitButtonElement = formElement
      ? formElement.querySelector(submitButtonSelector)
      : document.querySelector(submitButtonSelector);

    if (
      inputElement &&
      (inputElement instanceof HTMLInputElement ||
        inputElement instanceof HTMLTextAreaElement)
    ) {
      console.log(`入力フィールド (${inputSelector}) を見つけました。`);
      inputElement.value = inputText;
      // Reactなどのフレームワーク用にinputイベントを発火
      const event = new Event("input", { bubbles: true });
      inputElement.dispatchEvent(event);
      console.log(`"${inputText}" を入力しました。`);

      if (submitButtonElement && submitButtonElement instanceof HTMLElement) {
        console.log(`送信ボタン (${submitButtonSelector}) を見つけました。`);
        // ボタンをクリックして送信 (少し遅延を入れると確実な場合がある)
        setTimeout(() => {
          submitButtonElement.click();
          console.log("送信ボタンをクリックしました。");
        }, 100); // 100ミリ秒待機
      } else {
        console.warn(
          `送信ボタン (${submitButtonSelector}) が見つかりませんでした。`
        );
      }
    } else {
      console.warn(
        `入力フィールド (${inputSelector}) が見つからないか、不正な要素です。`
      );
    }
    // --- ここまで元のフォーム操作ロジック ---
  } else {
    console.log(
      `画面内に "${searchText}" を含む表示要素は見つかりませんでした。`
    );
  }
})();
