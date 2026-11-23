const contentBox = _getContentBox()


function updateContent() {
  // contentBox.innerHTML = '';
  // const node = _createTextElement("this is text");
  // contentBox.appendChild(node)

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

/*
Update content when tabs are changed
*/
browser.tabs.onUpdated.addListener(updateContent);
browser.tabs.onRemoved.addListener(updateContent);
browser.tabs.onCreated.addListener(updateContent);
browser.tabs.onMoved.addListener(updateContent);


/*
When the sidebar loads, get the ID of its window,
and update its content.
*/
updateContent();

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
