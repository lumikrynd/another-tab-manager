const contentBox = getContentBox()
updateContent();

browser.tabs.onUpdated.addListener(updateContent);
browser.tabs.onRemoved.addListener(updateContent);
browser.tabs.onCreated.addListener(updateContent);
browser.tabs.onMoved.addListener(updateContent);
browser.tabs.onActivated.addListener(updateContent);


function tabSetActive(changeTo: number) {
  browser.tabs.update(changeTo, { active: true })
}

async function updateContent() {
  const [tabs, window] = await Promise.all([
    browser.tabs.query({}),
    browser.windows.getCurrent(),
  ]);

  contentBox.innerHTML = '';
  for (const tab of tabs) {
    const node = createTabElement(tab, window);
    contentBox.appendChild(node)
  }
}

function createTabElement(
  tab: browser.tabs.Tab,
  window: browser.windows.Window) {
  const node = document.createElement("div");

  if (tab.active) {
    const attribute = (tab.windowId == window.id) ? "current" : "other";
    node.setAttribute("active", attribute);
  }

  const text = createTabText(tab);
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
