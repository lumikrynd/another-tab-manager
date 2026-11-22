let myWindowId: number;
const contentBox = _getContentBox()

/*
Make the content box editable as soon as the user mouses over the sidebar.
*/
window.addEventListener("mouseover", () => {
  contentBox.setAttribute("contenteditable", "true");
});

/*
When the user mouses out, save the current contents of the box.
*/
window.addEventListener("mouseout", () => {
  contentBox.setAttribute("contenteditable", "false");
  browser.tabs
    .query({ windowId: myWindowId, active: true })
    .then((tabs) => {
      let contentToStore: { [key: string]: any; } = {};
      let key = tabs[0].url ?? "";
      contentToStore[key] = contentBox.textContent;
      browser.storage.local.set(contentToStore);
    });
});

/*
Update the sidebar's content.

1) Get the active tab in this sidebar's window.
2) Get its stored content.
3) Put it in the content box.
*/
function updateContent() {
  browser.tabs.query({ windowId: myWindowId, active: true })
    .then((tabs) => {
      return browser.storage.local.get(tabs[0].url);
    })
    .then((storedInfo) => {
      contentBox.textContent = storedInfo[Object.keys(storedInfo)[0]];
    });
}

/*
Update content when a new tab becomes active.
*/
browser.tabs.onActivated.addListener(updateContent);

/*
Update content when a new page is loaded into a tab.
*/
browser.tabs.onUpdated.addListener(updateContent);

/*
When the sidebar loads, get the ID of its window,
and update its content.
*/
browser.windows.getCurrent({ populate: true }).then((windowInfo) => {
  myWindowId = windowInfo.id ?? myWindowId;
  updateContent();
});

function _getContentBox(): Element {
  const x = document.querySelector("#content");
  if (x == null)
    throw new Error('no content box???')
  return x
}
