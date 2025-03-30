<script lang="ts">
  import { goto } from '$app/navigation';
  import { pb } from '$lib/pocketbase';
  import { Button } from '$lib/components/ui/button/index.js';
  import * as Card from '$lib/components/ui/card/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Label } from '$lib/components/ui/label/index.js';
  import { toast } from 'svelte-sonner';
  import { LoaderCircle } from 'lucide-svelte';

  let loading = false;

  let email = '';
  let password = '';
  let passwordConfirm = '';

  async function onSubmit() {
    let error = '';

    if (!email || !password || !passwordConfirm) {
      error = 'Please fill out all fields.';
    }
    if (password !== passwordConfirm) {
      error = 'Passwords do not match.';
    }
    if (password.length < 8 || passwordConfirm.length > 72) {
      error = 'Password must be between 8 and 72 characters.';
    }

    if (error === '') {
      loading = true;

      const data = {
        password: password,
        passwordConfirm: passwordConfirm,
        email: email,
        emailVisibility: true,
        verified: false
      };

      try {
        const record = await pb.collection('users').create(data);

        await pb.collection('users').requestVerification(email);
        toast.success('Verification email sent');
        await goto('/groups');
      } catch (err) {
        error = /** @type {Error} */ (err as Error).message;
      }
      loading = false;
    }

    if (error !== '') {
      toast.error(error);
    }
  }
</script>

<div class="flex h-screen items-center justify-center">
  <Card.Root class="mx-auto max-w-sm">
    <Card.Header>
      <Card.Title class="text-2xl">Register</Card.Title>
      <Card.Description>Fill in the form to create a new account</Card.Description>
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
          <div class="grid gap-2">
            <div class="flex items-center">
              <Label for="password">Repeat password</Label>
            </div>
            <Input bind:value={passwordConfirm} id="passwordConfirm" type="password" required />
          </div>
          <Button type="submit" class="w-full" disabled={loading}>
            {#if loading}
              <LoaderCircle class="animate-spin" />
            {:else}
              Register
            {/if}
          </Button>
          <div class="mt-4 text-center text-sm">
            <a href="/sign-in" class="underline">Already have an accoun?</a>
          </div>
        </div>
      </form>
    </Card.Content>
  </Card.Root>
</div>
