<script>
  import { pb } from '$lib/pocketbase';
  import { Button } from '$lib/components/ui/button/index.js';
  import * as Card from '$lib/components/ui/card/index.js';
  import { Input } from '$lib/components/ui/input/index.js';
  import { Label } from '$lib/components/ui/label/index.js';
  import { toast } from 'svelte-sonner';

  let error = '';
  let loading = false;

  let email = '';
  let success = false;

  async function onSubmit() {
    if (!email) {
      error = 'Please fill out all fields.';
      return;
    }
    loading = true;
    try {
      success = await pb.collection('users').requestPasswordReset(email);
      if (!success) {
        error = 'Failed to send password reset email.';
      } else {
        toast.success('Successfully sent email with reset instructions');
      }
    } catch (err) {
      error = /** @type {Error} */ (err).message;
    }
    loading = false;

    if (error !== '') {
      toast.error(error);
    }
  }
</script>

<div class="flex min-h-screen w-full items-center justify-center">
  <Card.Root class="mx-auto max-w-sm">
    <Card.Header>
      <Card.Title class="text-2xl">Reset password</Card.Title>
      <Card.Description>
        Enter your email below to revceive an email to reset your passwrd.
      </Card.Description>
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
              placeholder="m@example.com"
              required
            />
          </div>
          <Button type="submit" class="w-full" disabled={loading}>Reset</Button>
        </div>
        <div class="mt-4 text-center text-sm">
          <a href="/sign-in" class="underline">Back to sign in</a>
        </div>
      </form>
    </Card.Content>
  </Card.Root>
</div>
