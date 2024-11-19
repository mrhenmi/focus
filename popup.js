import { browserAPI } from './browser-polyfill.js';

document.addEventListener('DOMContentLoaded', function() {
  const sitesList = document.getElementById('sites-list');
  const newSiteInput = document.getElementById('new-site');
  const startTimeInput = document.getElementById('start-time');
  const endTimeInput = document.getElementById('end-time');
  const addButton = document.getElementById('add-site');

  // Load existing blocked sites
  browserAPI.storage.sync.get(['blockedSites'], function(result) {
    const sites = result.blockedSites || [];
    sites.forEach(site => addSiteToList(site));
  });

  // Add new site
  addButton.addEventListener('click', function() {
    const site = newSiteInput.value.trim();
    const startTime = startTimeInput.value;
    const endTime = endTimeInput.value;

    if (site && startTime && endTime) {
      const siteData = { url: site, startTime, endTime };
      
      browserAPI.storage.sync.get(['blockedSites'], function(result) {
        const sites = result.blockedSites || [];
        sites.push(siteData);
        browserAPI.storage.sync.set({ blockedSites: sites }, function() {
          addSiteToList(siteData);
          newSiteInput.value = '';
          startTimeInput.value = '';
          endTimeInput.value = '';
        });
      });
    }
  });

  function addSiteToList(siteData) {
    const div = document.createElement('div');
    div.className = 'site-entry';
    div.innerHTML = `
      ${siteData.url} (${siteData.startTime} - ${siteData.endTime})
      <button class="remove-site">Remove</button>
    `;

    div.querySelector('.remove-site').addEventListener('click', function() {
      browserAPI.storage.sync.get(['blockedSites'], function(result) {
        const sites = result.blockedSites.filter(s => 
          s.url !== siteData.url || 
          s.startTime !== siteData.startTime || 
          s.endTime !== siteData.endTime
        );
        browserAPI.storage.sync.set({ blockedSites: sites }, function() {
          div.remove();
        });
      });
    });

    sitesList.appendChild(div);
  }
});