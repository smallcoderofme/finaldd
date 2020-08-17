const tpl_next = `</div></div></div></div><div class="col-md-2"></div></div><script>
  function list() {
    let index = location.href.indexOf('/content');
    let back = location.href.substring(0,index);
    window.location.href = back;
  }
  $(function () {
      let size = getScreenState();
      if (size.width < size.height) {
          document.querySelector('#background_img').setAttribute('src', '../../../assets/sbg.jpg')
      }
  });
  function getScreenState() {
      if(window.innerHeight !== undefined){
          return {
              "width": window.innerWidth,
              "height": window.innerHeight
          }

      }else if(document.compatMode === "CSS1Compat"){
          return {
              "width": document.documentElement.clientWidth,
              "height": document.documentElement.clientHeight
          }
      }else{
          return {
              "width": document.body.clientWidth,
              "height": document.body.clientHeight
          }
      }
  }
</script></body></html>`;
const tpl_pre = `<!DOCTYPE html><html><head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, height=device-height, initial-scale=1.0, maximum-scale=1.0">
  <script src="/bower_components/jquery/dist/jquery.min.js"></script>

  <!-- Include Font Awesome. -->
  <link href="/bower_components/font-awesome/css/fontawesome.min.css" rel="stylesheet" type="text/css">

  <!-- Include Froala Editor styles -->
  <link rel="stylesheet" href="/bower_components/froala-wysiwyg-editor/css/froala_editor.min.css">
  <link rel="stylesheet" href="/bower_components/froala-wysiwyg-editor/css/froala_style.min.css">

  <!-- Include Froala Editor Plugins styles -->
  <link rel="stylesheet" href="/bower_components/froala-wysiwyg-editor/css/plugins/char_counter.css">
  <link rel="stylesheet" href="/bower_components/froala-wysiwyg-editor/css/plugins/code_view.css">
  <link rel="stylesheet" href="/bower_components/froala-wysiwyg-editor/css/plugins/colors.css">
  <link rel="stylesheet" href="/bower_components/froala-wysiwyg-editor/css/plugins/emoticons.css">
  <link rel="stylesheet" href="/bower_components/froala-wysiwyg-editor/css/plugins/file.css">
  <link rel="stylesheet" href="/bower_components/froala-wysiwyg-editor/css/plugins/fullscreen.css">
  <link rel="stylesheet" href="/bower_components/froala-wysiwyg-editor/css/plugins/image_manager.css">
  <link rel="stylesheet" href="/bower_components/froala-wysiwyg-editor/css/plugins/image.css">
  <link rel="stylesheet" href="/bower_components/froala-wysiwyg-editor/css/plugins/line_breaker.css">
  <link rel="stylesheet" href="/bower_components/froala-wysiwyg-editor/css/plugins/table.css">
  <link rel="stylesheet" href="/bower_components/froala-wysiwyg-editor/css/plugins/video.css">
  <link rel="stylesheet" type="text/css" href="/node_modules/bootstrap/dist/css/bootstrap.min.css">

  <!-- Include Froala Editor -->
  <script src="/bower_components/froala-wysiwyg-editor/js/froala_editor.min.js"></script>

  <!-- Include Froala Editor Plugins -->
  <script src="/bower_components/froala-wysiwyg-editor/js/plugins/align.min.js"></script>
  <script src="/bower_components/froala-wysiwyg-editor/js/plugins/char_counter.min.js"></script>
  <script src="/bower_components/froala-wysiwyg-editor/js/plugins/code_beautifier.min.js"></script>
  <script src="/bower_components/froala-wysiwyg-editor/js/plugins/code_view.min.js"></script>
  <script src="/bower_components/froala-wysiwyg-editor/js/plugins/colors.min.js"></script>
  <script src="/bower_components/froala-wysiwyg-editor/js/plugins/emoticons.min.js"></script>
  <script src="/bower_components/froala-wysiwyg-editor/js/plugins/entities.min.js"></script>
  <script src="/bower_components/froala-wysiwyg-editor/js/plugins/file.min.js"></script>
  <script src="/bower_components/froala-wysiwyg-editor/js/plugins/font_family.min.js"></script>
  <script src="/bower_components/froala-wysiwyg-editor/js/plugins/font_size.min.js"></script>
  <script src="/bower_components/froala-wysiwyg-editor/js/plugins/fullscreen.min.js"></script>
  <script src="/bower_components/froala-wysiwyg-editor/js/plugins/image.min.js"></script>
  <script src="/bower_components/froala-wysiwyg-editor/js/plugins/image_manager.min.js"></script>
  <script src="/bower_components/froala-wysiwyg-editor/js/plugins/inline_style.min.js"></script>
  <script src="/bower_components/froala-wysiwyg-editor/js/plugins/line_breaker.min.js"></script>
  <script src="/bower_components/froala-wysiwyg-editor/js/plugins/link.min.js"></script>
  <script src="/bower_components/froala-wysiwyg-editor/js/plugins/lists.min.js"></script>
  <script src="/bower_components/froala-wysiwyg-editor/js/plugins/paragraph_format.min.js"></script>
  <script src="/bower_components/froala-wysiwyg-editor/js/plugins/paragraph_style.min.js"></script>
  <script src="/bower_components/froala-wysiwyg-editor/js/plugins/quote.min.js"></script>
  <script src="/bower_components/froala-wysiwyg-editor/js/plugins/save.min.js"></script>
  <script src="/bower_components/froala-wysiwyg-editor/js/plugins/table.min.js"></script>
  <script src="/bower_components/froala-wysiwyg-editor/js/plugins/video.min.js"></script>
  <script src="/bower_components/froala-wysiwyg-editor/js/plugins/edit_in_popup.min.js"></script>
  <!-- End Froala -->
  <style>
    .Site {
        display: flex;
        min-height: 100vh;
        flex-direction: column;
        padding: 20px;
    }

    .Site-content {
        flex: 1;
    }

    video {
        margin: 10px;
    }

    #mask {
        background: white;
        width: auto;
        height: 100%;
    }

    .blank {
        min-height: 5rem;
    }

    .unselect {
        user-select: none;
    }
    body {
        padding: 20px;
        overflow: hidden;
    }

    .sample {
        padding-bottom: 50px;
        margin-left: 20px;
        margin-right: 20px;
        /*border-top: 1px solid lightgray;*/
    }

    .manual {
        margin-bottom: 20px;
    }

    .content {
        height: 100vh;
    }

    .point {
        cursor: pointer;
    }

    video {
        margin: 10px;
    }

    #mask {
        background: white;
        width: auto;
        height: 100%;
    }
    .scroll_ctx {
        height: 100vh;
        overflow-y: overlay;
    }

    .login-bg {
        background-image: url("../assets/loginBg.png");
        background-size: cover;
    }

    .img_btn {
         background: url(../assets/btnBg.png);
         background-size: 28rem;
         width: 28rem;
         height: 9.5rem;
         border: none;
         font-size: 3.5rem;
     }

    .img_home {
        background: url(../assets/img_Home.png);
        background-size: 16rem;
        width: 16rem;
        height: 16rem;
        border: none;
    }
  </style>
</head>
<body>
  <script type="text/javascript">
      function list() {
        history.back();
      }
  </script>
  <div class="row">
    <div class="col-md-2">
      <button type="button" data-toggle="tooltip" style="position: absolute; z-index: 999999;"
            title="返回列表" class="btn btn-outline-success btn-sm" onclick="list();"><</button></div>
    <div class="col-md-8 scroll_ctx">
      <div class="fr-box fr-basic fr-top" role="application">
        <div class="fr-wrapper" style="border: 1px solid #CCCCCC;" dir="auto">
        <div class="fr-element fr-view" dir="auto" aria-disabled="false" spellcheck="true">`;

exports.tmplate_0 = tpl_pre;
exports.tmplate_1 = tpl_next;