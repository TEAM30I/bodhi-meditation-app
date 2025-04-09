
// Image Repository
// This file contains references to images used throughout the application

interface ImageCollection {
  profiles: {
    [key: string]: string;
  };
  scriptures: {
    [key: string]: string;
  };
  temples: {
    [key: string]: string;
  };
  backgrounds: {
    [key: string]: string;
  };
  icons: {
    [key: string]: string;
  };
}

export const imageRepository: ImageCollection = {
  profiles: {
    user1: "https://source.unsplash.com/random/200x200/?portrait",
    user2: "https://source.unsplash.com/random/200x200/?face",
    user3: "https://source.unsplash.com/random/200x200/?person",
    user4: "https://source.unsplash.com/random/200x200/?avatar",
    user5: "https://source.unsplash.com/random/200x200/?profile",
    bodhisattva: "https://source.unsplash.com/random/200x200/?statue",
    "김시훈": "https://source.unsplash.com/random/200x200/?profile=1",
    "정보리": "https://source.unsplash.com/random/200x200/?profile=2",
    "이지혜": "https://source.unsplash.com/random/200x200/?profile=3",
    "박정수": "https://source.unsplash.com/random/200x200/?profile=4",
    default: "https://source.unsplash.com/random/200x200/?silhouette"
  },
  scriptures: {
    "heart-sutra": "https://source.unsplash.com/random/400x300/?buddhism=1",
    "diamond-sutra": "https://source.unsplash.com/random/400x300/?buddhism=2",
    "lotus-sutra": "https://source.unsplash.com/random/400x300/?buddhism=3",
    "sixpatriarch-sutra": "https://source.unsplash.com/random/400x300/?buddhism=4",
    default: "https://source.unsplash.com/random/400x300/?scripture"
  },
  temples: {
    "bulguksa": "https://source.unsplash.com/random/400x300/?temple=1",
    "haeinsa": "https://source.unsplash.com/random/400x300/?temple=2",
    "jogyesa": "https://source.unsplash.com/random/400x300/?temple=3",
    "tongdosa": "https://source.unsplash.com/random/400x300/?temple=4",
    "songgwangsa": "https://source.unsplash.com/random/400x300/?temple=5",
    default: "https://source.unsplash.com/random/400x300/?buddhist-temple"
  },
  backgrounds: {
    main: "https://source.unsplash.com/random/1920x1080/?nature",
    login: "https://source.unsplash.com/random/1920x1080/?zen",
    profile: "https://source.unsplash.com/random/1920x1080/?abstract",
    scripture: "https://source.unsplash.com/random/1920x1080/?manuscript",
    calendar: "https://source.unsplash.com/random/1920x1080/?pattern",
    default: "https://source.unsplash.com/random/1920x1080/?gradient"
  },
  icons: {
    lotus: "https://source.unsplash.com/random/100x100/?lotus",
    buddha: "https://source.unsplash.com/random/100x100/?buddha",
    meditation: "https://source.unsplash.com/random/100x100/?meditation",
    prayer: "https://source.unsplash.com/random/100x100/?prayer",
    temple: "https://source.unsplash.com/random/100x100/?temple",
    default: "https://source.unsplash.com/random/100x100/?icon"
  }
};

/**
 * Get a profile image by user ID or name
 * @param id User ID or name
 * @returns Image URL
 */
export function getProfileImage(id: string): string {
  return imageRepository.profiles[id] || imageRepository.profiles.default;
}

/**
 * Get a scripture image by scripture ID
 * @param id Scripture ID
 * @returns Image URL
 */
export function getScriptureImage(id: string): string {
  return imageRepository.scriptures[id] || imageRepository.scriptures.default;
}

/**
 * Get a temple image by temple ID
 * @param id Temple ID
 * @returns Image URL
 */
export function getTempleImage(id: string): string {
  return imageRepository.temples[id] || imageRepository.temples.default;
}

/**
 * Get a background image by type
 * @param type Background type
 * @returns Image URL
 */
export function getBackgroundImage(type: string): string {
  return imageRepository.backgrounds[type] || imageRepository.backgrounds.default;
}

/**
 * Get an icon image by type
 * @param type Icon type
 * @returns Image URL
 */
export function getIconImage(type: string): string {
  return imageRepository.icons[type] || imageRepository.icons.default;
}
