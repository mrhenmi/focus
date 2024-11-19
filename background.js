/*
import { browserAPI } from './browser-polyfill.js';

function redirect(requestDetails) {
  browserAPI.storage.sync.get(['blockedSites'], function(result) {
    const sites = result.blockedSites || [];
    const url = new URL(details.url);
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();

    sites.forEach(site => {
      if (url.hostname.includes(site.url)) {
        const [startHour, startMinute] = site.startTime.split(':').map(Number);
        const [endHour, endMinute] = site.endTime.split(':').map(Number);

        const isBlocked = isTimeInRange(
          currentHour, 
          currentMinute,
          startHour,
          startMinute,
          endHour,
          endMinute
        );

        if (isBlocked) {
            return {
                redirectUrl:
                "blocked.html",
            };
        }
      }
    });
  });
}

browserAPI.webRequest.onBeforeRequest.addListener(
  redirect,
  { urls: ["<all_urls>"] },
  ["blocking"],
);

function isTimeInRange(currentHour, currentMinute, startHour, startMinute, endHour, endMinute) {
  const current = currentHour * 60 + currentMinute;
  const start = startHour * 60 + startMinute;
  const end = endHour * 60 + endMinute;

  if (start <= end) {
    return current >= start && current <= end;
  } else {
    // Handles overnight ranges (e.g., 22:00 - 06:00)
    return current >= start || current <= end;
  }
}
*/

import { browserAPI } from './browser-polyfill.js';

function isTimeInRange(currentHour, currentMinute, startHour, startMinute, endHour, endMinute) {
  const current = currentHour * 60 + currentMinute;
  const start = startHour * 60 + startMinute;
  const end = endHour * 60 + endMinute;
  
  return current >= start && current <= end;
}

function redirect(details) {
  return new Promise((resolve) => {
    browserAPI.storage.sync.get(['blockedSites']).then(result => {
      const sites = result.blockedSites || [];
      const url = new URL(details.url);
      const currentTime = new Date();
      const currentHour = currentTime.getHours();
      const currentMinute = currentTime.getMinutes();
      
      for (const site of sites) {
        if (url.hostname.includes(site.url)) {
          const [startHour, startMinute] = site.startTime.split(':').map(Number);
          const [endHour, endMinute] = site.endTime.split(':').map(Number);
          
          const isBlocked = isTimeInRange(
            currentHour, 
            currentMinute,
            startHour,
            startMinute,
            endHour,
            endMinute
          );
           
          if (isBlocked) {
            resolve({
              redirectUrl: browserAPI.runtime.getURL("blocked.html")
            });
            return;
          }
        }
      }
    resolve()
    });
  });
}

browserAPI.webRequest.onBeforeRequest.addListener(
  redirect,
  { urls: ["<all_urls>"], types: ["main_frame"]},
  ["blocking"]
);