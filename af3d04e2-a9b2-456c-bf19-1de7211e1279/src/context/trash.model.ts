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
  removeTrash: (NoticeId: string) => void;
};

export const useTrashNoticeStore = create<State & Actions>((set) => ({
  notices: [],
  setNotices: (newNotices) =>
    set(() => ({
      notices: newNotices,
    })),
  removeTrash: (noticeId) =>
    set((state) => ({
      notices: state.notices.filter((n) => n.ID !== noticeId),
    })),
}));
