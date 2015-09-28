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

  $(document).on('FileAdded', '.test', function(event) {
    console.log('.test added', event.originalEvent.detail);
  });

  $(document).on('FileProgress', '.test', function(event) {
    var percent = parseInt(event.originalEvent.detail.percent * 100);
    var percentText = '' + percent + '% completed';
    $('.test-progress').val(percent);
    $('.test-progress-text').html(percentText);
  });

  $(document).on('FileUploaded', '.test', function(event) {
    console.log('.test uploaded', event.originalEvent.detail);
    $('.test-progress').val(0);
    $('.test-progress-text').html('');

    var $image = $('<img />');
    $image.attr('src', event.originalEvent.detail.response.url);
    $image.appendTo('body');
  });


  $(document).on('FileAdded', function(event) {
    console.log('document', event.originalEvent.detail);
  });
});