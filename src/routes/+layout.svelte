<script>
  import { pb } from '$lib/pocketbase';
  import { onMount, setContext } from 'svelte';
  import { writable } from 'svelte/store';
  import '../app.css';
  import { ModeWatcher } from 'mode-watcher';
  import { Toaster } from '$lib/components/ui/sonner/index.js';

  let { children } = $props();

  const token = writable(pb.authStore.token);
  const user = writable(pb.authStore.record);

  onMount(() => {
    const unsubscribe = pb.authStore.onChange((newToken, model) => {
      token.set(newToken);
      user.set(model);
      if (model) {
        localStorage.setItem('hasSignedIn', 'true');
      }
    }, true);
    return () => {
      unsubscribe();
    };
  });

  setContext('token', token);
  setContext('user', user);

  export const trailingSlash = 'always';
</script>

<Toaster richColors />
<ModeWatcher />
{@render children?.()}
