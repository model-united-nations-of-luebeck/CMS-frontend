<template>
  <div>
    <div class="registration">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: "Registration",
};
</script>

<style lang="scss">
.registration {
  .input-container {
    display: flex;
    justify-content: center;
    margin: 0 -12px;
  }

  .input-container > * {
    padding: 0 12px;
  }

  .spaced > * {
    padding-top: 12px;
    padding-bottom: 12px;
  }
  .spaced > * > * {
    padding-left: 12px;
    padding-right: 12px;
  }
  h1 {
    text-transform: uppercase;
    font-weight: bold;
    font-size: 48pt;
    line-height: 1.5;
  }

  p {
    font-size: 24px;
    line-height: 1.25em;
    color: #646464;
    text-align: justify;
  }

  .append {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .spaced,
  .form {
    margin: 0 -12px;
  }

  .form {
    text-align: left;
    font-size: 24px;
    line-height: 1.25em;
    color: #646464;
  }

  .slider {
    padding-top: 40px;
  }
}
</style>
