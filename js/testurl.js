  $("input.share-url").change(function() {
    console.log(this.value);
    OGBox.crawlForURL(this.value);
  });