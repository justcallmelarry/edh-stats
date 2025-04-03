<script lang="ts">
  export let children: any;
</script>

<div class="relative py-4">
  <div class="absolute inset-0 flex items-center">
    <div class="w-full border-b border-gray-300 dark:border-secondary"></div>
  </div>
  <div class="relative flex justify-center">
    <span class="bg-white px-4 text-sm text-gray-500 dark:bg-black"><slot>{children}</slot></span>
  </div>
</div>
