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
  notices: Notice[];
};

type Actions = {
  setNotices: (newNotices: Notice[]) => void;
  markAsRead: (NoticeId: string) => void;
  moveTrash: (NoticeId: string) => void;
  markAllAsRead: () => void;
};

export const useNoticeStore = create<State & Actions>((set) => ({
  notices: [],
  setNotices: (newNotices) =>
    set(() => ({
      notices: newNotices,
    })),
  moveTrash: (noticeId) =>
    set((state) => ({
      notices: state.notices.filter((n) => n.ID !== noticeId),
    })),
  markAsRead: (noticeId) =>
    set((state) => ({
      notices: state.notices.map((n) =>
        n.ID === noticeId ? { ...n, Read: "true" } : n
      ),
    })),
  markAllAsRead: () =>
    set((state) => ({
      notices: state.notices.map((n) => ({ ...n, Read: "true" })),
    })),
}));
