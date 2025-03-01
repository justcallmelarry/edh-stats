<script lang="ts">
  import { goto } from '$app/navigation';
  import { pb } from '$lib/pocketbase';
  import { Button } from '$lib/components/ui/button/index.js';
  import * as Card from '$lib/components/ui/card/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Label } from '$lib/components/ui/label/index.js';
  import { toast } from 'svelte-sonner';
  import { LoaderCircle } from 'lucide-svelte';

  let error = '';
  let loading = false;

  let email = '';
  let password = '';

  async function onSubmit() {
    if (!email || !password) {
      error = 'Please fill out all fields.';
      return;
    }
    loading = true;
    try {
      const authResult = await pb.collection('users').authWithPassword(email, password);
      error = '';
      await goto('/home');
    } catch (err) {
      error = (err as Error).message;
    }
    loading = false;
    if (error !== '') {
      toast.error(error);
    }
  }
</script>

<div class="h-screen flex items-center justify-center">
  <Card.Root class="mx-auto max-w-sm">
    <Card.Header>
      <Card.Title class="text-2xl">Login</Card.Title>
      <Card.Description>Enter your email below to login to your account</Card.Description>
    </Card.Header>
    <Card.Content>
      <form on:submit|preventDefault={onSubmit} class="card-body">
        <div class="grid gap-4">
          <div class="grid gap-2">
            <Label for="email">Email</Label>
            <Input
              bind:value={email}
              id="email"
              type="email"
              placeholder="email@example.com"
              required
            />
          </div>
          <div class="grid gap-2">
            <div class="flex items-center">
              <Label for="password">Password</Label>
            </div>
            <Input bind:value={password} id="password" type="password" required />
          </div>
          <Button type="submit" class="w-full" disabled={loading}>
            {#if loading}
              <LoaderCircle class="animate-spin" />
            {:else}
              Login
            {/if}
          </Button>
          <div class="mt-4 text-center text-sm">
            <a href="/reset-password" class="underline">Forgot your password?</a>
          </div>
        </div>
      </form>
    </Card.Content>
  </Card.Root>
</div>
