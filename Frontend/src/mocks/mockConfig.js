// Central toggle for mock usage
// Priority: VITE_USE_MOCK env variable; default true (portfolio demo)
export const isMockEnabled = () => {
  try {
    const flag = import.meta?.env?.VITE_USE_MOCK;
    if (flag === 'true') return true;
    if (flag === 'false') return false;
  } catch (e) {
    // ignore
  }
  return true; // default ON for portfolio showcase
};

// Helper to simulate latency
export const mockDelay = (min = 200, max = 600) => new Promise(res => setTimeout(res, Math.random() * (max - min) + min));
