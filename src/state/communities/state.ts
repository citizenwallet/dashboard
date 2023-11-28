import { StoreApi, UseBoundStore, create } from "zustand";
import { devtools } from "zustand/middleware";
import type {} from "@redux-devtools/extension"; // required for devtools typing
import { Config } from "@/services/config";

type CommunityStore = {
  communities: Config[];
  loading: boolean;
  error: boolean;
  fetchCommunitiesRequest: () => void;
  fetchCommunitiesSuccess: (communities: Config[]) => void;
  fetchCommunitiesFailure: () => void;
};

export const useCommunitiesStore = create<CommunityStore>()(
  devtools((set) => ({
    communities: [],
    loading: false,
    error: false,
    fetchCommunitiesRequest: () => set({ loading: true, error: false }),
    fetchCommunitiesSuccess: (communities: Config[]) =>
      set({ communities, loading: false, error: false }),
    fetchCommunitiesFailure: () => set({ loading: false, error: true }),
  }))
);
