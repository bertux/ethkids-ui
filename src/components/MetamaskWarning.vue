<template>
  <div class="check-metamask" v-if="showMetamaskWarning">
    <div v-if="!this.$store.state.web3.isInjected || this.$store.state.readOnly">
      <h2 class="highlighted">Please install Metamask</h2>
      <p>You need <a href="https://metamask.io/" target="_blank">Metamask</a> Ethereum extension to contribute to the EthKids communities.</p>
      <p>Without Metamask you can only see the current status</p>
    </div>
    <div v-if="this.$store.state.web3.isInjected && !this.$store.state.web3.coinbase">
      <h2>Please login into Metamask</h2>
      <p>You are not connected to Ethereum node. Please login into Metamask.</p>
      <p>
        <router-link to="/about">What is EthKids</router-link>
      </p>
    </div>
  </div>
</template>

<script>

export default {
  name: 'MetamaskWarning',
  data() {
    return {
      showMetamaskWarning: false,
    };
  },
  created() {
    setTimeout(() => {
      this.showMetamaskWarning = true;
    }, 500);
  },
};
</script>

<style lang="scss" scoped>
  .check-metamask {
    border: 1px dashed red;
    border-radius: 10px;
    margin: 10px 10px 0px 10px;
    padding: 10px 10px 0px 10px;
    display: inline-block;
  }
</style>
