ipfsAPI = require('ipfs-api');
const fs = require('fs')


// node.on('error', errorObject => console.error(errorObject))

var getMessages = function (ipfs, channel, msgHandler, cb) {
  var files = ipfs.files.ls('./data_ipfs/'+channel)
  return await Promise.all(files.map(
    f => msgHandler(f.content))).then(function(){
      cb();
    }).catch(function (e) {
      console.error(e);
      cb();
  });;

};

var insert = function(ipfs, channel, msgHandler, cb){
  const file = [
    {
      path: './data_ipfs/'+ channel,
      content: msgHandler
    }
  ]
  ipfs.files.add(file, function(err, res) {
    
  }).then(function () {
    cb();
})
};

module.exports.create = async function (
    conf /*:ChainPadServer_Config_t*/,
    cb /*:(store:ChainPadServer_Storage_t)=>void*/
) {var conff =  {
  path: "./data_ipfs"
}
  var ipfs = IpfsApi({
    host: 'localhost',
    port: 5001,
    protocol: 'http',
    headers: {
      // authorization: 'Bearer ' + TOKEN
    }
  });
  
  if (!fs.existsSync(conff.path)) {
    //if file not exists
    console.log("creating file location")
    ipfs.files.mkdir(conff.path, {parent: true})
  }

  // ipfs.files.ls(conf.path, {long: true}).filter(file=> (file.name === "data" && file.type === 1));

    cb({
      message: function (channelName, content, cb) {
          insert(db, channelName, content, cb);
      },
      getMessages: function (channelName, msgHandler, cb) {
          getMessages(db, channelName, msgHandler, cb);
      }
  });


}