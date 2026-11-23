const contentBox = _getContentBox()
updateContent();

browser.tabs.onUpdated.addListener(updateContent);
browser.tabs.onRemoved.addListener(updateContent);
browser.tabs.onCreated.addListener(updateContent);
browser.tabs.onMoved.addListener(updateContent);


function updateContent() {
  browser.tabs.query({ })
    .then((tabs) => {
      contentBox.innerHTML = '';
      for (const tab of tabs) {
        const text = _createTabText(tab);
        const node = _createTextElement(text);
        contentBox.appendChild(node)
      }
    });
}

function _createTextElement(text: string) {
    const node = document.createElement("div");
    node.innerHTML = text;
    return node;
}

function _getContentBox(): Element {
  const x = document.querySelector("#content");
  if (x == null)
    throw new Error('no content box???')
  return x
}

function _createTabText(tab: browser.tabs.Tab): string {
  const id = tab.id?.toString() ?? "undefined";
  const title = tab.title ?? "";
  const window = tab.windowId ?? "?";

  return `${id} (${window}) - "${title}"`
}
