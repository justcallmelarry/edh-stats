<script lang="ts">
  export let children: any;
</script>

<span class="shimmer">
  <slot>{children}</slot>
</span>

<style>
  .shimmer {
    display: inline-block;
    color: white;

    background: black -webkit-gradient(
        linear,
        100% 0,
        0 0,
        from(black),
        color-stop(0.5, #eab308),
        to(black)
      );

    -webkit-animation-duration: 4s;
    -webkit-animation-iteration-count: infinite;
    -webkit-animation-name: shimmer;
    -webkit-background-clip: text;
    -webkit-background-size: 4rem 100%; /*50px*/
    -webkit-text-fill-color: transparent;
    animation-duration: 4s;
    animation-iteration-count: infinite;
    animation-name: shimmer;
    background-clip: text;
    background-position: -4rem top; /*50px*/
    background-repeat: no-repeat;
    background-size: 4rem 100%; /*50px*/
  }

  :global(.dark) {
    .shimmer {
      background: white -webkit-gradient(
          linear,
          100% 0,
          0 0,
          from(white),
          color-stop(0.5, #eab308),
          to(white)
        );
      -webkit-animation-duration: 4s;
      -webkit-animation-iteration-count: infinite;
      -webkit-animation-name: shimmer;
      -webkit-background-clip: text;
      -webkit-background-size: 4rem 100%; /*50px*/
      -webkit-text-fill-color: transparent;
      animation-duration: 4s;
      animation-iteration-count: infinite;
      animation-name: shimmer;
      background-clip: text;
      background-position: -4rem top; /*50px*/
      background-repeat: no-repeat;
      background-size: 4rem 100%; /*50px*/
    }
  }

  @-webkit-keyframes shimmer {
    0% {
      background-position: -4rem top; /*50px*/
    }

    70% {
      background-position: 12.5rem top; /*200px*/
    }

    100% {
      background-position: 12.5rem top; /*200px*/
    }
  }

  @keyframes shimmer {
    0% {
      background-position: -4rem top; /*50px*/
    }

    70% {
      background-position: 12.5rem top; /*200px*/
    }

    100% {
      background-position: 12.5rem top; /*200px*/
    }
  }
</style>
