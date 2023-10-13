function callback() {
  return {
    cancel: true,
  };
}

function start() {
  chrome.storage.local.get('config', function (res) {
    if (!('config' in res)) {
      // writing settings will invoke chrome.storage.onChanged
      chrome.storage.local.set({
        config: DEFAULT_SETTINGS,
      });
    } else {
      if (res.config.status) {
        // on
        for (let item of res.config.rules) {
          if (!('status' in item) || item.status) {
            chrome.webRequest.onBeforeRequest.addListener(
              callback,
              {
                urls: item.urls,
                types: item.types,
              },
              ['blocking']
            );
          }
        }
      }
    }
  });
}

chrome.browserAction.onClicked.addListener(function () {
  chrome.runtime.openOptionsPage();
});

chrome.storage.onChanged.addListener(function () {
  // clear
  chrome.webRequest.onBeforeRequest.removeListener(callback);

  // restart
  start();
});

// start
start();
