<script lang="ts">
  export let children: any;
</script>

<div class="separator pb-4 text-sm text-neutral-500"><slot>{children}</slot></div>

<style>
  .separator {
    display: flex;
    align-items: center;
    text-align: center;
  }

  .separator::before,
  .separator::after {
    content: '';
    flex: 1;
    border-bottom: 1px solid rgb(229, 231, 235);
  }

  .separator:not(:empty)::before {
    margin-right: 0.25em;
  }

  .separator:not(:empty)::after {
    margin-left: 0.25em;
  }
</style>
