const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      
      on('task', {
        csvToJson (data) {
          // remove first character from string
          data = data.substring(1);
          var lines=data.split("\n");
          var result = [];
          var headers=lines[0].replace(/['"]+/g, '').split(",");
          for(var i=1;i<lines.length;i++){
        
              var obj = {};
              var currentline=lines[i].split(",\"");
        
              for(var j=0;j<headers.length;j++){
                  var key = headers[j];
                  var value = currentline[j].replace(/['"]+/g, '');
                  obj[key] = value;
              }
              result.push(obj);
          }
          // console.log(result)
          return result
        }
      })

    },
  },
});
