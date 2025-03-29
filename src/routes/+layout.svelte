<script>
  import { pb } from '$lib/pocketbase';
  import { onMount, setContext } from 'svelte';
  import { PUBLIC_DEV_ENV } from '$env/static/public';
  import { writable } from 'svelte/store';
  import '../app.css';
  import { ModeWatcher } from 'mode-watcher';
  import { Toaster } from '$lib/components/ui/sonner/index.js';
  import DevEnv from '$lib/components/DevEnv.svelte';

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
</script>

<Toaster richColors toastOptions={{}} />
<ModeWatcher />
{#if PUBLIC_DEV_ENV}
  <DevEnv />
{/if}
{@render children?.()}
