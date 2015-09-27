$(function() {
  DeepUploader.register({
    name: 'image',
    uploader: 'qiniu',
    uptokenUrl: 'http://jssdk.demo.qiniu.io/uptoken',
    bucket: 'qiniu-plupload',
    domain: 'http://qiniu-plupload.qiniudn.com/',
    accept: 'image/*'
  });

  $(document).on('click', '.test', DeepUploader.browseHandler);

  $(document).on('FileAdded', '.test1', function(event) {
    console.log('test1', event.originalEvent.detail);
  });

  $(document).on('FileAdded', '.test', function(event) {
    console.log('.test', event.originalEvent.detail);
  });

  $(document).on('FileUploaded', '.test', function(event) {
    console.log('.test', event.originalEvent.detail);

    var $image = $('<img />');
    $image.attr('src', event.originalEvent.detail.response.url);
    $image.appendTo('body');
  });

  $(document).on('FileAdded', function(event) {
    console.log('document', event.originalEvent.detail);
  });
});