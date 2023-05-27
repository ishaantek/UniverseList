const cache = {
  bots: {},
  servers: {},
};

function addToBotCache(botId, botInfo) {
  cache.bots[botId] = botInfo;
}

function getFromBotCache(botId) {
  return cache.bots[botId] || null;
}

function removeFromBotCache(botId) {
  delete cache.bots[botId];
}

function addToServerCache(serverId, serverInfo) {
  cache.servers[serverId] = serverInfo;
}

function getFromServerCache(serverId) {
  return cache.servers[serverId] || null;
}

function removeFromServerCache(serverId) {
  delete cache.servers[serverId];
}

module.exports = {
  addToBotCache,
  getFromBotCache,
  removeFromBotCache,
  addToServerCache,
  getFromServerCache,
  removeFromServerCache,
};
