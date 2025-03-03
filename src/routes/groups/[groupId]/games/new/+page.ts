export const prerender = false;
export const ssr = false;
import { TABS } from '$lib/constants';

export const load = () => {
  return {
    tab: TABS.ADD_GAME
  };
};