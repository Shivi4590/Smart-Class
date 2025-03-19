/* eslint-disable no-restricted-globals */
const processStats = async (data) => {
  // Process the statistics
  return {
    ...data,
    processed: true,
    timestamp: new Date().toISOString()
  };
};

// Handle data processing in background
self.addEventListener('message', async (e) => {
  const { type, data } = e.data;
  
  switch (type) {
    case 'PROCESS_STATS':
      // Process statistics in background
      const processed = await processStats(data);
      self.postMessage({ type: 'STATS_READY', data: processed });
      break;
    default:
      break;
  }
}); 