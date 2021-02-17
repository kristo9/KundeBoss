const fs = require("fs-extra");
 
const webConfigPath = "./build/web.config";
 
if (fs.existsSync(webConfigPath)) {
    fs.unlinkSync(webConfigPath);
}

module.exports = {
    module: {
      loaders: [{ 
        test: /\.css$/, 
        loader: "style-loader!css-loader" 
      }]    
  }};

fs.copySync("./webconfig/web.config", webConfigPath);