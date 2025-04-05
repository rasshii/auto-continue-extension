// background.js

// 拡張機能のアイコンがクリックされたときのリスナー
chrome.action.onClicked.addListener((tab) => {
  // tabオブジェクトにはアクティブなタブの情報が含まれる
  if (tab.id) {
    // scripting.executeScriptを使ってcontent_script.jsを注入・実行
    chrome.scripting
      .executeScript({
        target: { tabId: tab.id }, // どのタブで実行するか
        files: ["content_script.js"], // 実行するファイル
      })
      .then(() => {
        console.log("Content script injected and executed.");
      })
      .catch((err) => {
        console.error("Failed to inject script: ", err);
      });
  } else {
    console.error("Could not get active tab ID.");
  }
});
