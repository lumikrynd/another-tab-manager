const contentBox = getContentBox()
updateContent();

browser.tabs.onUpdated.addListener(updateContent);
browser.tabs.onRemoved.addListener(updateContent);
browser.tabs.onCreated.addListener(updateContent);
browser.tabs.onMoved.addListener(updateContent);


function tabSetActive(changeTo: number) {
  browser.tabs.update(changeTo, { active: true })
}

function updateContent() {
  browser.tabs.query({})
    .then((tabs) => {
      contentBox.innerHTML = '';
      for (const tab of tabs) {
        const node = createTabElement(tab);
        contentBox.appendChild(node)
      }
    });
}

function createTabElement(tab: browser.tabs.Tab) {
  const text = createTabText(tab);
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

function getContentBox(): Element {
  const x = document.querySelector("#content");
  if (x == null)
    throw new Error('no content box???')
  return x
}

function createTabText(tab: browser.tabs.Tab): string {
  const id = tab.id?.toString() ?? "undefined";
  const title = tab.title ?? "";
  const window = tab.windowId ?? "?";

  return `${id} (${window}) - "${title}"`
}
