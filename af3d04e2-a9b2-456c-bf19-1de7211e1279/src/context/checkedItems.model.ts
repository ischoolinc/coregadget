import { create } from "zustand";

type State = {
  checkedItems: string[];
};

type Actions = {
  setCheckedItems: (items: string[]) => void;
  toggleCheckedItem: (ID: string) => void;
  removeCheckedItem: (ID: string) => void;
};
export const useCheckedItemStore = create<State & Actions>((set) => ({
  checkedItems: [],
  setCheckedItems: (items) => set({ checkedItems: items }),
  toggleCheckedItem: (ID) =>
    set((state) => ({
      checkedItems: state.checkedItems.includes(ID)
        ? state.checkedItems.filter((item) => item !== ID)
        : [...state.checkedItems, ID],
    })),
  removeCheckedItem: (ID) =>
    set((state) => ({
      checkedItems: state.checkedItems.filter((item) => item !== ID),
    })),
}));
