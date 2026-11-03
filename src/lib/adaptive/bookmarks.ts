export const BOOKMARKS_STORAGE_KEY = 'ml_in_motion_bookmarks_v1';

export function getBookmarks(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to get bookmarks', e);
    return [];
  }
}

export function isBookmarked(lessonId: string): boolean {
  const bookmarks = getBookmarks();
  return bookmarks.includes(lessonId);
}

export function toggleBookmark(lessonId: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const bookmarks = getBookmarks();
    let updated: string[];
    let nowBookmarked: boolean;

    if (bookmarks.includes(lessonId)) {
      updated = bookmarks.filter((id) => id !== lessonId);
      nowBookmarked = false;
    } else {
      updated = [...bookmarks, lessonId];
      nowBookmarked = true;
    }

    localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('bookmarks-updated', { detail: updated }));
    return nowBookmarked;
  } catch (e) {
    console.error('Failed to toggle bookmark', e);
    return false;
  }
}
