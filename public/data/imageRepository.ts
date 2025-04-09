
// Image Repository
// This file contains references to images used throughout the application

export const imageRepository = {
  templeBanner: {
    default: "https://via.placeholder.com/1200x400/DE7834/FFFFFF/?text=Buddhist+Temple+Banner"
  },
  logo: {
    default: "https://via.placeholder.com/200x200/DE7834/FFFFFF/?text=Logo"
  },
  temples: {
    default: "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=Temple"
  }
};

// Helper functions for getting specific images
export function getProfileImage(id: string): string {
  return "https://via.placeholder.com/200x200/DE7834/FFFFFF/?text=Profile";
}

export function getScriptureImage(id: string): string {
  return "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=Scripture";
}

export function getTempleImage(id: string): string {
  return "https://via.placeholder.com/400x300/DE7834/FFFFFF/?text=Temple";
}

export function getBackgroundImage(type: string): string {
  return "https://via.placeholder.com/1920x1080/DE7834/FFFFFF/?text=Background";
}

export function getIconImage(type: string): string {
  return "https://via.placeholder.com/100x100/DE7834/FFFFFF/?text=Icon";
}
