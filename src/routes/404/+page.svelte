<script>
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { X } from 'lucide-svelte';
</script>

<div class="flex min-h-screen items-center justify-center bg-background p-4">
  <Card class="mx-auto max-w-md shadow-lg">
    <CardHeader>
      <div class="mb-2 flex justify-center">
        <div class="flex items-center justify-center rounded-full bg-muted p-4">
          <X class="h-10 w-10 text-destructive" />
        </div>
      </div>
      <CardTitle class="text-center text-4xl font-bold">404</CardTitle>
    </CardHeader>
    <CardContent>
      <div class="space-y-4 text-center">
        <h2 class="text-2xl font-semibold tracking-tight">Page not found</h2>
        <p class="text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>
    </CardContent>
    <CardFooter class="flex justify-center pb-6">
      <Button href="/groups" variant="default" size="lg">Go back home</Button>
    </CardFooter>
  </Card>
</div>

<style>
  /* Optional: Add a subtle background pattern */
  .bg-background {
    background-image: radial-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 0);
    background-size: 20px 20px;
  }
</style>
