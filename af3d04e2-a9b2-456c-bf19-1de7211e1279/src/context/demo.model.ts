import { create } from "zustand";

type State = {
    bears: number;
};

type Action = {
    increasePopulation: () => void;
    decreasePopulation: () => void;
    removeAllBears: () => void;
};

const defaultState: State = {
    bears: 0,
};

export const useDemoModelStore = create<State & Action>((set) => ({
    ...defaultState,
    increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
    decreasePopulation: () => set((state) => ({ bears: state.bears - 1 })),
    removeAllBears: () => set({ bears: 0 }),
}));