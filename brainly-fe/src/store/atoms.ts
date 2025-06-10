import { atom } from "recoil";

interface Inputs {
  title: string;
  link: string;
  tags: string[];
}

export const inputValueState = atom<Inputs>({
  key: "inputValue1",
  default: { title: "", link: "", tags: [] },
});

export const tagsState = atom<string[]>({
  key: "tagsState",
  default: [],
});
