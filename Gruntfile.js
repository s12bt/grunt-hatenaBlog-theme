var URL = "http://s12bt-themes.hatenablog.jp/";
var articlePage = "http://s12bt-themes.hatenablog.jp/entry/1";
var categoryName = "sample1";
var themeTitle = "sampleTheme";

var themeFile = themeTitle + ".css";
var http = require("http");
var fs = require("fs");


module.exports = function(grunt){
  // プラグイン読み込み
  grunt.loadNpmTasks("grunt-contrib-less");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks("grunt-contrib-connect");
  grunt.loadNpmTasks("grunt-open");

  var init = {
    less: {
      development: {
        files: {}
      },
      production: {
        options: {
          cleancss: true
        },
        files: {}
      }
    },
    watch: {
      options: {
        livereload: true,
      },
      //監視対象とするファイル
      files : ["*.less","less/*.less"],
      tasks : ["less:development"]
    },

    connect: {
      site: {
      }
    },

    open: {
      top : {
        path : "http://localhost:8000/top.html?" + Date.now()
      },
      article : {
        path : "http://localhost:8000/article.html?" + Date.now()
      },
      about : {
        path : "http://localhost:8000/about.html?" + Date.now()
      },
      archive : {
        path : "http://localhost:8000/archive.html?" + Date.now()
      },
      category : {
        path : "http://localhost:8000/category.html?" + Date.now()
      },
      archiveCategory : {
        path : "http://localhost:8000/archive-category.html?" + Date.now()
      }
    }
  };

  init.less.development.files[themeFile] = "boilerplate.less";
  init.less.production.files[themeFile] = "boilerplate.less";

  grunt.initConfig(init);

  grunt.registerTask("default", ["less:development","connect", "open:top", "watch"]);

  grunt.registerTask("update-hatena-template", function(){
    var done = this.async();

    var pageName = ["top", "article", "about", "archive", "category", "archive-category"];
    var URLstring = [URL, articlePage, URL + "about", URL + "archive", URL + "category/" + categoryName, URL + "archive/category/" + categoryName];

    URLstring.forEach(function(url, i){
      console.log(url);
      http.get(url, function(res) {

        var body = "";
        res.setEncoding("utf8");
        res.on("data", function(chunk) {
          body += chunk;
        });
        res.on("end", function() {
          body = body.replace(/href="\/style\/.*"/, 'href="' + themeFile + '"');
          fs.appendFileSync( pageName[i] + ".html", body);
          if (i == 6) {
            done(true);
          }
        })
      }).on("error", function(e) {
        console.log(e.message);
        done(e);
      });
    });
  });
}