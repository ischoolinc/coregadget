import { create } from "zustand";

type Notice = {
  ID: string;
  Category: string;
  Title: string;
  PostTime: string;
  Read: string;
  Message: string;
};

type State = {
  searchNotices: Notice[];
};

type Actions = {
  setSearchNotices: (newNotices: Notice[]) => void;
  markSearchAsRead: (NoticeId: string) => void;
  moveSearchTrash: (NoticeId: string) => void;
  markSearchAllAsRead: () => void;
};

export const useSearchNoticeStore = create<State & Actions>((set) => ({
  searchNotices: [],
  setSearchNotices: (newNotices) =>
    set(() => ({
      searchNotices: newNotices,
    })),
  moveSearchTrash: (noticeId) =>
    set((state) => ({
      searchNotices: state.searchNotices.filter((n) => n.ID !== noticeId),
    })),
  markSearchAsRead: (noticeId) =>
    set((state) => ({
      searchNotices: state.searchNotices.map((n) =>
        n.ID === noticeId ? { ...n, Read: "true" } : n
      ),
    })),
  markSearchAllAsRead: () =>
    set((state) => ({
      searchNotices: state.searchNotices.map((n) => ({ ...n, Read: "true" })),
    })),
}));
