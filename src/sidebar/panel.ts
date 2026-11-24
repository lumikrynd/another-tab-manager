const contentBox = _getContentBox()
_updateContent();

browser.tabs.onUpdated.addListener(_updateContent);
browser.tabs.onRemoved.addListener(_updateContent);
browser.tabs.onCreated.addListener(_updateContent);
browser.tabs.onMoved.addListener(_updateContent);


function tabSetActive(changeTo: number) {
  browser.tabs.update(changeTo, { active: true })
}

function _updateContent() {
  browser.tabs.query({})
    .then((tabs) => {
      contentBox.innerHTML = '';
      for (const tab of tabs) {
        const node = _createTabElement(tab);
        contentBox.appendChild(node)
      }
    });
}

function _createTabElement(tab: browser.tabs.Tab) {
  const text = _createTabText(tab);
  const node = document.createElement("div");
  node.innerHTML = text;
  node.setAttribute("title", text)
  node.addEventListener("click", _ => {
    if (tab.id !== undefined) {
      tabSetActive(tab.id)
    }
  })
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
