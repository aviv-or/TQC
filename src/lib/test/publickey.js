'use strict';

var should = require('chai').should();
var expect = require('chai').expect;

var pqccore = require('..');
var BN = pqccore.crypto.BN;
var PrivateKey = pqccore.PrivateKey;
var Networks = pqccore.Networks;
var PublicKey = pqccore.PublicKey;
var Address = pqccore.Address;

/* jshint maxlen: 200 */

describe('PublicKey', function() {

  var invalidPoint = '0400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';

  describe('validating errors on creation', function() {
    it('errors if data is missing', function() {
      (function() {
        return new PublicKey();
      }).should.throw('First argument is required, please include public key data.');
    });

    it('errors if an invalid DER string is provided', function() {
      (function() {
        return new PublicKey(invalidPoint);
      }).should.throw('Failed to match tag: "seq" at: (shallow)');
    });

    it('errors if the argument is of an unrecognized type', function() {
      (function() {
        return new PublicKey(new Error());
      }).should.throw('First argument is an unrecognized data format.');
    });
  });

  describe('instantiation', function() {

    it('from a private key', function () {
      var privhex = '906977a061af29276e40bf377042ffbde414e496ae2260bbf1fa9d085637bfff';
      var pubhex = '308204080382040400010300061028404f5db24e6a34b31813ec990f29a11b0a6b2e54f4d0f3e77e6a345b7929ee6396b495c61328dd83a2a2b7c300f96cdbf4d66d968d17afc1d0561ea6d322fc1d7140a75ec341a74382e23357922191668c60aab3e5c654dd4cc6b1e4a5805a525c81f93751baffeccb90154471675a2123720c480fff31e4a2d206e8aa90969aabf09ce3bee7a01737e01ac82cfcaa2b3c75537e6c9165e5df27aa1a857d2d90bbc0dc3b5ee80933308827b33bb03c82303a4c610af316a99ce0892420163f5f89dbf3b9f53befcd8b27d9ad2fc7f679da8153e83092188a995d8be8dfb4c382a1f042f1f5e844aca761591f3d28ff77a449f015ddc0b08cb673076530f638ec5723862b49eefbfd0cf1ff2e57abd1acfb66dc85717b46976e758153f71ffc94a3dbd7873bfa45afafd8006450bdac6912c08757f2ff4799e63af4598b7b3fcae3e8d8e9378a0621937422ef3452b241f0ad0c7d79627451af725f992736e3a35431e65d0d267f533ebaa62b28a139c74a73623c67c964cef7497b63a6658f3e2bfc78e46ffce141c5a081196b3186a87cadc9f630914fca59558c1fdfff25daa46f5aa6cc43ae80f07a52f7b23313553ffac916b459d501219866b99c28cb7a92dc55d8ea1121c3ae0bb73db196fec2d2c11322b1d9eb0a13ed9dc01b57dc0ebefc3cbfc9108a9e3d8d0d7e5d05fbe0264bb2b5019f37e73d42034a30f2ccf8a98c620911a742d31f2d5266f1a8c272e77d432f64bf74357489f9a0ad66a720be7d9d2b3efea80b1ac7dc2682253f6d72de3ec7505085552744185b5e8f34982ffaaacf492728de9e7ea0bb5e10a2be0985147a46047fb6c9252fe4aa35d8a2cfb479b6855417d0b9039ff57ec3923714adc8c8f1e5da3e722e355b6eefee6758f46f060635261f365ded95f1cbd7bba31a1d9a2ec9af8f2fc1fa91ed0d7c05e1a3e66a49d1beec5ceb6b3027fb5d0fd703cf3186e3b623f296e4e5fefe67662fe9d98cb84a625201a1dc163eb80eb448cfce79ddd32b0594ce695712de6bf3a01e56d4279b41fc3f97693cf1a246e5dac4b005605f44ddd34c28cd1e48e160ef06aecb47d52772ad910e59dc9a8289fb52d19d2aadba07f3975089e77b01c0ec418f78e8638df8260c31fb45afc2cb06c67640b65cb8fae02acd85999b15f88d9ec4c0118db20c0914ab0331a4ca14b9b5cc757edea4670d38f6b60e81100c3b128e4e21cedaeaaa991a77b247da1fee300ae3575303eba946ddbeb76b5f428c05bb8ce95541aa272b4c583120839b025736097e4a12f9c4455bf7eaa252a37de98c6acc0d68ab781f529b2631d4a278db6b8933bfc034496d3bfaee6b5ee4e07c00d74eb0054e1369ef21bd0edc8e987a3417e748f802c2a2aa5f9c8b0f7d1dc229998b04118ce4af10a49ae493a5e08acf80b8965c2c730d658e60';
      var privkey = new PrivateKey(new BN(new Buffer(privhex, 'hex')));
      var pk = new PublicKey(privkey);
      pk.toString().should.equal(pubhex);
    });

    it('problematic secp256k1 public keys', function () {

      var knownKeys = [
        {
          wif: 'KzsjKq2FVqVuQv2ueHVFuB65A9uEZ6S1L6F8NuokCrE3V3kE3Ack',
          priv: '6d1229a6b24c2e775c062870ad26bc261051e0198c67203167273c7c62538846',
          pub: '308204080382040400010300061028404f5db24e6a34b31813ec990f29a11b0a6b2e54f4d0f3e77e6a345b7929ee6396b495c61328dd83a2a2b7c300f96cdbf4d66d968d17afc1d0561ea6d322fc1d7140a75ec341a74382e23357922191668c60aab3e5c654dd4cc6b1e4a5805a525c81f93751baffeccb90154471675a2123720c480fff31e4a2d206e8aa90969aabf09ce3bee7a01737e01ac82cfcaa2b3c75537e6c9165e5df27aa1a857d2d90bbc0dc3b5ee80933308827b33bb03c82303a4c610af316a99ce0892420163f5f89dbf3b9f53befcd8b27d9ad2fc7f679da8153e83092188a995d8be8dfb4c382a1f042f1f5e844aca761591f3d28ff77a449f015ddc0b08cb673076530f638ec5723862b49eefbfd0cf1ff2e57abd1acfb66dc85717b46976e758153f71ffc94a3dbd7873bfa45afafd8006450bdac6912c08757f2ff4799e63af4598b7b3fcae3e8d8e9378a0621937422ef3452b241f0ad0c7d79627451af725f992736e3a35431e65d0d267f533ebaa62b28a139c74a73623c67c964cef7497b63a6658f3e2bfc78e46ffce141c5a081196b3186a87cadc9f630914fca59558c1fdfff25daa46f5aa6cc43ae80f07a52f7b23313553ffac916b459d501219866b99c28cb7a92dc55d8ea1121c3ae0bb73db196fec2d2c11322b1d9eb0a13ed9dc01b57dc0ebefc3cbfc9108a9e3d8d0d7e5d05fbe0264bb2b5019f37e73d42034a30f2ccf8a98c620911a742d31f2d5266f1a8c272e77d432f64bf74357489f9a0ad66a720be7d9d2b3efea80b1ac7dc2682253f6d72de3ec7505085552744185b5e8f34982ffaaacf492728de9e7ea0bb5e10a2be0985147a46047fb6c9252fe4aa35d8a2cfb479b6855417d0b9039ff57ec3923714adc8c8f1e5da3e722e355b6eefee6758f46f060635261f365ded95f1cbd7bba31a1d9a2ec9af8f2fc1fa91ed0d7c05e1a3e66a49d1beec5ceb6b3027fb5d0fd703cf3186e3b623f296e4e5fefe67662fe9d98cb84a625201a1dc163eb80eb448cfce79ddd32b0594ce695712de6bf3a01e56d4279b41fc3f97693cf1a246e5dac4b005605f44ddd34c28cd1e48e160ef06aecb47d52772ad910e59dc9a8289fb52d19d2aadba07f3975089e77b01c0ec418f78e8638df8260c31fb45afc2cb06c67640b65cb8fae02acd85999b15f88d9ec4c0118db20c0914ab0331a4ca14b9b5cc757edea4670d38f6b60e81100c3b128e4e21cedaeaaa991a77b247da1fee300ae3575303eba946ddbeb76b5f428c05bb8ce95541aa272b4c583120839b025736097e4a12f9c4455bf7eaa252a37de98c6acc0d68ab781f529b2631d4a278db6b8933bfc034496d3bfaee6b5ee4e07c00d74eb0054e1369ef21bd0edc8e987a3417e748f802c2a2aa5f9c8b0f7d1dc229998b04118ce4af10a49ae493a5e08acf80b8965c2c730d658e60',
        },
        {
          wif: 'L5MgSwNB2R76xBGorofRSTuQFd1bm3hQMFVf3u2CneFom8u1Yt7G',
          priv: 'f2cc9d2b008927db94b89e04e2f6e70c180e547b3e5e564b06b8215d1c264b53',
          pub: '308204080382040400010300061028404f5db24e6a34b31813ec990f29a11b0a6b2e54f4d0f3e77e6a345b7929ee6396b495c61328dd83a2a2b7c300f96cdbf4d66d968d17afc1d0561ea6d322fc1d7140a75ec341a74382e23357922191668c60aab3e5c654dd4cc6b1e4a5805a525c81f93751baffeccb90154471675a2123720c480fff31e4a2d206e8aa90969aabf09ce3bee7a01737e01ac82cfcaa2b3c75537e6c9165e5df27aa1a857d2d90bbc0dc3b5ee80933308827b33bb03c82303a4c610af316a99ce0892420163f5f89dbf3b9f53befcd8b27d9ad2fc7f679da8153e83092188a995d8be8dfb4c382a1f042f1f5e844aca761591f3d28ff77a449f015ddc0b08cb673076530f638ec5723862b49eefbfd0cf1ff2e57abd1acfb66dc85717b46976e758153f71ffc94a3dbd7873bfa45afafd8006450bdac6912c08757f2ff4799e63af4598b7b3fcae3e8d8e9378a0621937422ef3452b241f0ad0c7d79627451af725f992736e3a35431e65d0d267f533ebaa62b28a139c74a73623c67c964cef7497b63a6658f3e2bfc78e46ffce141c5a081196b3186a87cadc9f630914fca59558c1fdfff25daa46f5aa6cc43ae80f07a52f7b23313553ffac916b459d501219866b99c28cb7a92dc55d8ea1121c3ae0bb73db196fec2d2c11322b1d9eb0a13ed9dc01b57dc0ebefc3cbfc9108a9e3d8d0d7e5d05fbe0264bb2b5019f37e73d42034a30f2ccf8a98c620911a742d31f2d5266f1a8c272e77d432f64bf74357489f9a0ad66a720be7d9d2b3efea80b1ac7dc2682253f6d72de3ec7505085552744185b5e8f34982ffaaacf492728de9e7ea0bb5e10a2be0985147a46047fb6c9252fe4aa35d8a2cfb479b6855417d0b9039ff57ec3923714adc8c8f1e5da3e722e355b6eefee6758f46f060635261f365ded95f1cbd7bba31a1d9a2ec9af8f2fc1fa91ed0d7c05e1a3e66a49d1beec5ceb6b3027fb5d0fd703cf3186e3b623f296e4e5fefe67662fe9d98cb84a625201a1dc163eb80eb448cfce79ddd32b0594ce695712de6bf3a01e56d4279b41fc3f97693cf1a246e5dac4b005605f44ddd34c28cd1e48e160ef06aecb47d52772ad910e59dc9a8289fb52d19d2aadba07f3975089e77b01c0ec418f78e8638df8260c31fb45afc2cb06c67640b65cb8fae02acd85999b15f88d9ec4c0118db20c0914ab0331a4ca14b9b5cc757edea4670d38f6b60e81100c3b128e4e21cedaeaaa991a77b247da1fee300ae3575303eba946ddbeb76b5f428c05bb8ce95541aa272b4c583120839b025736097e4a12f9c4455bf7eaa252a37de98c6acc0d68ab781f529b2631d4a278db6b8933bfc034496d3bfaee6b5ee4e07c00d74eb0054e1369ef21bd0edc8e987a3417e748f802c2a2aa5f9c8b0f7d1dc229998b04118ce4af10a49ae493a5e08acf80b8965c2c730d658e60',
        }
      ];

      for (var i = 0; i < knownKeys.length; i++) {
        var privkey = new PrivateKey(knownKeys[i].wif);
        var pubkey = privkey.toPublicKey();
        pubkey.toString().should.equal(knownKeys[i].pub);
      }

    });

    it('from a compressed public key', function () {
      var publicKeyHex = '30820408038204040080c00060081402f2ba4d72562ccd18c83799f09485d850d6742a2f0bcfe77e562cda9e9477c6692da963c814bbc14545edc3009f36db2f6bb669b1e8f5830b6a7865cb443fb88e02e57ac382e5c24147ccea49848966310655cda7632abb32638d27a5015a4a3a819fec8a5dff37d309a8228ee65a84c44e3012f0ff8c27454b601755096959d50f39c77de705e8ec075813343f55d43caeca7e3689a6a7fbe45558a1beb409dd033bdc7a1790cc0c11e4cddc0d3c410c5c328650cf6895390791240468fcfa91dbcf9dafdcf7b3d1e49bb5f4e36f9e5b81ca170c49185199bad117fb2dc341850f428faf172235e5869af8bc14ffee25920fa8bb030d316dcee0a60c6f1c37eac461d49277dfbf308fff74ead58b35df663ba18ede62e976ae81caeff83f29c5dbebe1dc5fa2f5f51b00260abd35964803e1ea4fffe299675c2f9ad1defc53c7171b97ec516084c92e44f72c4a4d820fb530be9e462e8af54efa99e46cc7c52a8c67bab064feca7c5d65d414859ce352ce463ce6932673ef92dec665a6f17cd43f1e27f63f8782a3058198d68c61153eb5936f0c89f2539aaa31f8fbffa45b25f65a6533c275010f5e4aef4dccc8aafc5f93682d9aab808419669d3914d35e493baa1b578884c375d0edbc8d697f434b83c8448d9bd750c8b7b903d8ea3b707d3f3cfd93085179bcb1b07ebaa0df0764d24dad80f9ece7bc42c0520c4f331f9531469088e542cbf8b44a668f15434ee7bec2f426fd2eac2e919f05b566e5047dbeb9d47c7f15d058e33b6441a4fcb64e7b7ce30a0aa1aae42218da7af12c19f45f55f392e4147b797e05dd7a08457d90a1285e6220fe6d93a4f42755ac1b45f32d9e6da12ae80b9dc0f9af7ec349ec28b513138fa75b7c4e74acda76f777e61a2ff66060ac64f86cbab7a98fd3ebddc558b8597493f5f1f4835f89b7b03ea087c56756928b7d373ad7d60ce4dfbaf0ebc0f38c61c76dc44f6927a77f7fe666f4979b311d52464a80853b687c1d702d12f3739ebbcbd4a0297396ea487bd6cf05786a2be4d9823ffce9963c8f4562a75b230da006fa22bbcb3214b378128706f76075d3e2abe44eb589709a3b594191df4a8bb954b55de0cfe90a91e7de80033782f11e17c6b11f64308cdfa2f543d360636e026d3a1d5f0754b3a199d9a81fb179230388b14d309028d5c08c2553289dad33ae7e7b25e6b01c6f6d70810830dc48717284735b57559958ee4de25bf8770c50c7eacac0d79562bb7dedd6fa4231a0dd3197aa8255e4d4321a8c04c1d940ea6c907e52489f23a2daef57454ac5be97315633b016d51ef84ad9648c2b451edbd691ccfd032c92b6dc5f77d67a27073e00eb720da072c896f784bd703b71195e2ce8e7121f40434555fa39d1f0beb8439499d120883127f508255927c9a50751f3011d693a34ceb0a67106';
      var publicKey = new PublicKey(publicKeyHex);
      console.log(78, publicKey.toString())
      publicKey.toString().should.equal(publicKeyHex);
    });
  })
  //
  //   it('from another publicKey', function() {
  //     var publicKeyHex = '031ff0fe0f7b15ffaa85ff9f4744d539139c252a49710fb053bb9f2b933173ff9a';
  //     var publicKey = new PublicKey(publicKeyHex);
  //     var publicKey2 = new PublicKey(publicKey);
  //     publicKey.should.equal(publicKey2);
  //   });
  //
  //   it('sets the network to defaultNetwork if none provided', function() {
  //     var publicKeyHex = '031ff0fe0f7b15ffaa85ff9f4744d539139c252a49710fb053bb9f2b933173ff9a';
  //     var publicKey = new PublicKey(publicKeyHex);
  //     publicKey.network.should.equal(Networks.defaultNetwork);
  //   });
  //
  //   it('from a hex encoded DER string', function() {
  //     var pk = new PublicKey('041ff0fe0f7b15ffaa85ff9f4744d539139c252a49710fb053bb9f2b933173ff9a7baad41d04514751e6851f5304fd243751703bed21b914f6be218c0fa354a341');
  //     should.exist(pk.point);
  //     pk.point.getX().toString(16).should.equal('1ff0fe0f7b15ffaa85ff9f4744d539139c252a49710fb053bb9f2b933173ff9a');
  //   });
  //
  //   it('from a hex encoded DER buffer', function() {
  //     var pk = new PublicKey(new Buffer('041ff0fe0f7b15ffaa85ff9f4744d539139c252a49710fb053bb9f2b933173ff9a7baad41d04514751e6851f5304fd243751703bed21b914f6be218c0fa354a341', 'hex'));
  //     should.exist(pk.point);
  //     pk.point.getX().toString(16).should.equal('1ff0fe0f7b15ffaa85ff9f4744d539139c252a49710fb053bb9f2b933173ff9a');
  //   });
  // });
  //
  //
  // describe('#getValidationError', function(){
  //
  //   it('should recieve an invalid point error', function() {
  //     var error = PublicKey.getValidationError(invalidPoint);
  //     should.exist(error);
  //     error.message.should.equal('Failed to match tag: "seq" at: (shallow)');
  //   });
  //
  //   it('should recieve a boolean as false', function() {
  //     var valid = PublicKey.isValid(invalidPoint);
  //     valid.should.equal(false);
  //   });
  //
  //   it('should recieve a boolean as true for uncompressed', function() {
  //     var valid = PublicKey.isValid('041ff0fe0f7b15ffaa85ff9f4744d539139c252a49710fb053bb9f2b933173ff9a7baad41d04514751e6851f5304fd243751703bed21b914f6be218c0fa354a341');
  //     valid.should.equal(true);
  //   });
  //
  //   it('should recieve a boolean as true for compressed', function() {
  //     var valid = PublicKey.isValid('031ff0fe0f7b15ffaa85ff9f4744d539139c252a49710fb053bb9f2b933173ff9a');
  //     valid.should.equal(true);
  //   });
  //
  // });
  //
  // describe('#json/object', function() {
  //
  //   it('should input/ouput json', function() {
  //     var json = JSON.stringify({
  //       x: '1ff0fe0f7b15ffaa85ff9f4744d539139c252a49710fb053bb9f2b933173ff9a',
  //       y: '7baad41d04514751e6851f5304fd243751703bed21b914f6be218c0fa354a341',
  //       compressed: false
  //     });
  //     var pubkey = new PublicKey(JSON.parse(json));
  //     JSON.stringify(pubkey).should.deep.equal(json);
  //   });
  //
  //   it('fails if "y" is not provided', function() {
  //     expect(function() {
  //       return new PublicKey({
  //         x: '1ff0fe0f7b15ffaa85ff9f4744d539139c252a49710fb053bb9f2b933173ff9a'
  //       });
  //     }).to.throw();
  //   });
  //
  //   it('fails if invalid JSON is provided', function() {
  //     expect(function() {
  //       return PublicKey._transformJSON('¹');
  //     }).to.throw();
  //   });
  //
  //   it('works for X starting with 0x00', function() {
  //     var a = new PublicKey('030589ee559348bd6a7325994f9c8eff12bd5d73cc683142bd0dd1a17abc99b0dc');
  //     var b = new PublicKey('03'+a.toObject().x);
  //     b.toString().should.equal(a.toString());
  //   });
  //
  // });
  //
  // describe('#fromPrivateKey', function() {
  //
  //   it('should make a public key from a privkey', function() {
  //     should.exist(PublicKey.fromPrivateKey(PrivateKey.fromRandom()));
  //   });
  //
  //   it('should error because not an instance of privkey', function() {
  //     (function() {
  //       PublicKey.fromPrivateKey(new Error());
  //     }).should.throw('Must be an instance of PrivateKey');
  //   });
  //
  // });
  //
  // describe('#fromBuffer', function() {
  //
  //   it('should parse this uncompressed public key', function() {
  //     var pk = PublicKey.fromBuffer(new Buffer('041ff0fe0f7b15ffaa85ff9f4744d539139c252a49710fb053bb9f2b933173ff9a7baad41d04514751e6851f5304fd243751703bed21b914f6be218c0fa354a341', 'hex'));
  //     pk.point.getX().toString(16).should.equal('1ff0fe0f7b15ffaa85ff9f4744d539139c252a49710fb053bb9f2b933173ff9a');
  //     pk.point.getY().toString(16).should.equal('7baad41d04514751e6851f5304fd243751703bed21b914f6be218c0fa354a341');
  //   });
  //
  //   it('should parse this compressed public key', function() {
  //     var pk = PublicKey.fromBuffer(new Buffer('031ff0fe0f7b15ffaa85ff9f4744d539139c252a49710fb053bb9f2b933173ff9a', 'hex'));
  //     pk.point.getX().toString(16).should.equal('1ff0fe0f7b15ffaa85ff9f4744d539139c252a49710fb053bb9f2b933173ff9a');
  //     pk.point.getY().toString(16).should.equal('7baad41d04514751e6851f5304fd243751703bed21b914f6be218c0fa354a341');
  //   });
  //
  //   it('should throw an error on this invalid public key', function() {
  //     (function() {
  //       PublicKey.fromBuffer(new Buffer('091ff0fe0f7b15ffaa85ff9f4744d539139c252a49710fb053bb9f2b933173ff9a', 'hex'));
  //     }).should.throw();
  //   });
  //
  //   it('should throw error because not a buffer', function() {
  //     (function() {
  //       PublicKey.fromBuffer('091ff0fe0f7b15ffaa85ff9f4744d539139c252a49710fb053bb9f2b933173ff9a');
  //     }).should.throw('Must be a hex buffer of DER encoded public key');
  //   });
  //
  //   it('should throw error because buffer is the incorrect length', function() {
  //     (function() {
  //       PublicKey.fromBuffer(new Buffer('041ff0fe0f7b15ffaa85ff9f4744d539139c252a49710fb053bb9f2b933173ff9a7baad41d04514751e6851f5304fd243751703bed21b914f6be218c0fa354a34112', 'hex'));
  //     }).should.throw('Length of x and y must be 32 bytes');
  //   });
  //
  // });
  //
  // describe('#fromDER', function() {
  //
  //   it('should parse this uncompressed public key', function() {
  //     var pk = PublicKey.fromDER(new Buffer('041ff0fe0f7b15ffaa85ff9f4744d539139c252a49710fb053bb9f2b933173ff9a7baad41d04514751e6851f5304fd243751703bed21b914f6be218c0fa354a341', 'hex'));
  //     pk.point.getX().toString(16).should.equal('1ff0fe0f7b15ffaa85ff9f4744d539139c252a49710fb053bb9f2b933173ff9a');
  //     pk.point.getY().toString(16).should.equal('7baad41d04514751e6851f5304fd243751703bed21b914f6be218c0fa354a341');
  //   });
  //
  //   it('should parse this compressed public key', function() {
  //     var pk = PublicKey.fromDER(new Buffer('031ff0fe0f7b15ffaa85ff9f4744d539139c252a49710fb053bb9f2b933173ff9a', 'hex'));
  //     pk.point.getX().toString(16).should.equal('1ff0fe0f7b15ffaa85ff9f4744d539139c252a49710fb053bb9f2b933173ff9a');
  //     pk.point.getY().toString(16).should.equal('7baad41d04514751e6851f5304fd243751703bed21b914f6be218c0fa354a341');
  //   });
  //
  //   it('should throw an error on this invalid public key', function() {
  //     (function() {
  //       PublicKey.fromDER(new Buffer('091ff0fe0f7b15ffaa85ff9f4744d539139c252a49710fb053bb9f2b933173ff9a', 'hex'));
  //     }).should.throw();
  //   });
  //
  // });
  //
  // describe('#fromString', function() {
  //
  //   it('should parse this known valid public key', function() {
  //     var pk = PublicKey.fromString('041ff0fe0f7b15ffaa85ff9f4744d539139c252a49710fb053bb9f2b933173ff9a7baad41d04514751e6851f5304fd243751703bed21b914f6be218c0fa354a341');
  //     pk.point.getX().toString(16).should.equal('1ff0fe0f7b15ffaa85ff9f4744d539139c252a49710fb053bb9f2b933173ff9a');
  //     pk.point.getY().toString(16).should.equal('7baad41d04514751e6851f5304fd243751703bed21b914f6be218c0fa354a341');
  //   });
  //
  // });
  //
  // describe('#toBuffer', function() {
  //
  //   it('should return this compressed DER format', function() {
  //     var x = BN.fromBuffer(new Buffer('1ff0fe0f7b15ffaa85ff9f4744d539139c252a49710fb053bb9f2b933173ff9a', 'hex'));
  //     var pk = PublicKey.fromX(true, x);
  //     pk.toBuffer().toString('hex').should.equal('031ff0fe0f7b15ffaa85ff9f4744d539139c252a49710fb053bb9f2b933173ff9a');
  //   });
  //
  //   it('should return this uncompressed DER format', function() {
  //     var x = BN.fromBuffer(new Buffer('1ff0fe0f7b15ffaa85ff9f4744d539139c252a49710fb053bb9f2b933173ff9a', 'hex'));
  //     var pk = PublicKey.fromX(true, x);
  //     pk.toBuffer().toString('hex').should.equal('031ff0fe0f7b15ffaa85ff9f4744d539139c252a49710fb053bb9f2b933173ff9a');
  //   });
  //
  // });
  //
  // describe('#toDER', function() {
  //
  //   it('should return this compressed DER format', function() {
  //     var x = BN.fromBuffer(new Buffer('1ff0fe0f7b15ffaa85ff9f4744d539139c252a49710fb053bb9f2b933173ff9a', 'hex'));
  //     var pk = PublicKey.fromX(true, x);
  //     pk.toDER().toString('hex').should.equal('031ff0fe0f7b15ffaa85ff9f4744d539139c252a49710fb053bb9f2b933173ff9a');
  //   });
  //
  //   it('should return this uncompressed DER format', function() {
  //     var pk = PublicKey.fromString('041ff0fe0f7b15ffaa85ff9f4744d539139c252a49710fb053bb9f2b933173ff9a7baad41d04514751e6851f5304fd243751703bed21b914f6be218c0fa354a341');
  //     pk.toDER().toString('hex').should.equal('041ff0fe0f7b15ffaa85ff9f4744d539139c252a49710fb053bb9f2b933173ff9a7baad41d04514751e6851f5304fd243751703bed21b914f6be218c0fa354a341');
  //   });
  // });
  //
  // describe('#toAddress', function() {
  //
  //   it('should output this known mainnet address correctly', function() {
  //     var pk = new PublicKey('30820408038204040080c00060081402f2ba4d72562ccd18c83799f09485d850d6742a2f0bcfe77e562cda9e9477c6692da963c814bbc14545edc3009f36db2f6bb669b1e8f5830b6a7865cb443fb88e02e57ac382e5c24147ccea49848966310655cda7632abb32638d27a5015a4a3a819fec8a5dff37d309a8228ee65a84c44e3012f0ff8c27454b601755096959d50f39c77de705e8ec075813343f55d43caeca7e3689a6a7fbe45558a1beb409dd033bdc7a1790cc0c11e4cddc0d3c410c5c328650cf6895390791240468fcfa91dbcf9dafdcf7b3d1e49bb5f4e36f9e5b81ca170c49185199bad117fb2dc341850f428faf172235e5869af8bc14ffee25920fa8bb030d316dcee0a60c6f1c37eac461d49277dfbf308fff74ead58b35df663ba18ede62e976ae81caeff83f29c5dbebe1dc5fa2f5f51b00260abd35964803e1ea4fffe299675c2f9ad1defc53c7171b97ec516084c92e44f72c4a4d820fb530be9e462e8af54efa99e46cc7c52a8c67bab064feca7c5d65d414859ce352ce463ce6932673ef92dec665a6f17cd43f1e27f63f8782a3058198d68c61153eb5936f0c89f2539aaa31f8fbffa45b25f65a6533c275010f5e4aef4dccc8aafc5f93682d9aab808419669d3914d35e493baa1b578884c375d0edbc8d697f434b83c8448d9bd750c8b7b903d8ea3b707d3f3cfd93085179bcb1b07ebaa0df0764d24dad80f9ece7bc42c0520c4f331f9531469088e542cbf8b44a668f15434ee7bec2f426fd2eac2e919f05b566e5047dbeb9d47c7f15d058e33b6441a4fcb64e7b7ce30a0aa1aae42218da7af12c19f45f55f392e4147b797e05dd7a08457d90a1285e6220fe6d93a4f42755ac1b45f32d9e6da12ae80b9dc0f9af7ec349ec28b513138fa75b7c4e74acda76f777e61a2ff66060ac64f86cbab7a98fd3ebddc558b8597493f5f1f4835f89b7b03ea087c56756928b7d373ad7d60ce4dfbaf0ebc0f38c61c76dc44f6927a77f7fe666f4979b311d52464a80853b687c1d702d12f3739ebbcbd4a0297396ea487bd6cf05786a2be4d9823ffce9963c8f4562a75b230da006fa22bbcb3214b378128706f76075d3e2abe44eb589709a3b594191df4a8bb954b55de0cfe90a91e7de80033782f11e17c6b11f64308cdfa2f543d360636e026d3a1d5f0754b3a199d9a81fb179230388b14d309028d5c08c2553289dad33ae7e7b25e6b01c6f6d70810830dc48717284735b57559958ee4de25bf8770c50c7eacac0d79562bb7dedd6fa4231a0dd3197aa8255e4d4321a8c04c1d940ea6c907e52489f23a2daef57454ac5be97315633b016d51ef84ad9648c2b451edbd691ccfd032c92b6dc5f77d67a27073e00eb720da072c896f784bd703b71195e2ce8e7121f40434555fa39d1f0beb8439499d120883127f508255927c9a50751f3011d693a34ceb0a67106');
  //     var address = pk.toAddress('livenet');
  //     address.toString().should.equal('1A6ut1tWnUq1SEQLMr4ttDh24wcbJ5o9TT');
  //   });
  //
  //   it('should output this known testnet address correctly', function() {
  //     var pk = new PublicKey('0293126ccc927c111b88a0fe09baa0eca719e2a3e087e8a5d1059163f5c566feef');
  //     var address = pk.toAddress('testnet');
  //     address.toString().should.equal('mtX8nPZZdJ8d3QNLRJ1oJTiEi26Sj6LQXS');
  //   });
  //
  // });
  //
  // describe('hashes', function() {
  //
  //   // wif private key, address
  //   // see: https://github.com/bitcoin/bitcoin/blob/master/src/test/key_tests.cpp#L20
  //   var data = [
  //     ['5HxWvvfubhXpYYpS3tJkw6fq9jE9j18THftkZjHHfmFiWtmAbrj', '1QFqqMUD55ZV3PJEJZtaKCsQmjLT6JkjvJ'],
  //     ['5KC4ejrDjv152FGwP386VD1i2NYc5KkfSMyv1nGy1VGDxGHqVY3', '1F5y5E5FMc5YzdJtB9hLaUe43GDxEKXENJ'],
  //     ['Kwr371tjA9u2rFSMZjTNun2PXXP3WPZu2afRHTcta6KxEUdm1vEw', '1NoJrossxPBKfCHuJXT4HadJrXRE9Fxiqs'],
  //     ['L3Hq7a8FEQwJkW1M2GNKDW28546Vp5miewcCzSqUD9kCAXrJdS3g', '1CRj2HyM1CXWzHAXLQtiGLyggNT9WQqsDs']
  //   ];
  //
  //   // data.forEach(function(d){
  //   //   var publicKey = PrivateKey.fromWIF(d[0]).toPublicKey();
  //   //   var address = Address.fromString(d[1]);
  //   //   address.hashBuffer.should.deep.equal(publicKey._getID());
  //   // });
  //
  // });
  //
  // describe('#toString', function() {
  //
  //   it('should print this known public key', function() {
  //     var hex = '30820408038204040080c00060081402f2ba4d72562ccd18c83799f09485d850d6742a2f0bcfe77e562cda9e9477c6692da963c814bbc14545edc3009f36db2f6bb669b1e8f5830b6a7865cb443fb88e02e57ac382e5c24147ccea49848966310655cda7632abb32638d27a5015a4a3a819fec8a5dff37d309a8228ee65a84c44e3012f0ff8c27454b601755096959d50f39c77de705e8ec075813343f55d43caeca7e3689a6a7fbe45558a1beb409dd033bdc7a1790cc0c11e4cddc0d3c410c5c328650cf6895390791240468fcfa91dbcf9dafdcf7b3d1e49bb5f4e36f9e5b81ca170c49185199bad117fb2dc341850f428faf172235e5869af8bc14ffee25920fa8bb030d316dcee0a60c6f1c37eac461d49277dfbf308fff74ead58b35df663ba18ede62e976ae81caeff83f29c5dbebe1dc5fa2f5f51b00260abd35964803e1ea4fffe299675c2f9ad1defc53c7171b97ec516084c92e44f72c4a4d820fb530be9e462e8af54efa99e46cc7c52a8c67bab064feca7c5d65d414859ce352ce463ce6932673ef92dec665a6f17cd43f1e27f63f8782a3058198d68c61153eb5936f0c89f2539aaa31f8fbffa45b25f65a6533c275010f5e4aef4dccc8aafc5f93682d9aab808419669d3914d35e493baa1b578884c375d0edbc8d697f434b83c8448d9bd750c8b7b903d8ea3b707d3f3cfd93085179bcb1b07ebaa0df0764d24dad80f9ece7bc42c0520c4f331f9531469088e542cbf8b44a668f15434ee7bec2f426fd2eac2e919f05b566e5047dbeb9d47c7f15d058e33b6441a4fcb64e7b7ce30a0aa1aae42218da7af12c19f45f55f392e4147b797e05dd7a08457d90a1285e6220fe6d93a4f42755ac1b45f32d9e6da12ae80b9dc0f9af7ec349ec28b513138fa75b7c4e74acda76f777e61a2ff66060ac64f86cbab7a98fd3ebddc558b8597493f5f1f4835f89b7b03ea087c56756928b7d373ad7d60ce4dfbaf0ebc0f38c61c76dc44f6927a77f7fe666f4979b311d52464a80853b687c1d702d12f3739ebbcbd4a0297396ea487bd6cf05786a2be4d9823ffce9963c8f4562a75b230da006fa22bbcb3214b378128706f76075d3e2abe44eb589709a3b594191df4a8bb954b55de0cfe90a91e7de80033782f11e17c6b11f64308cdfa2f543d360636e026d3a1d5f0754b3a199d9a81fb179230388b14d309028d5c08c2553289dad33ae7e7b25e6b01c6f6d70810830dc48717284735b57559958ee4de25bf8770c50c7eacac0d79562bb7dedd6fa4231a0dd3197aa8255e4d4321a8c04c1d940ea6c907e52489f23a2daef57454ac5be97315633b016d51ef84ad9648c2b451edbd691ccfd032c92b6dc5f77d67a27073e00eb720da072c896f784bd703b71195e2ce8e7121f40434555fa39d1f0beb8439499d120883127f508255927c9a50751f3011d693a34ceb0a67106';
  //     var pk = PublicKey.fromString(hex);
  //     pk.toString().should.equal(hex);
  //   });
  //
  // });
  //
  // describe('#inspect', function() {
  //   it('should output known uncompressed pubkey for console', function() {
  //     var pubkey = PublicKey.fromString('041ff0fe0f7b15ffaa85ff9f4744d539139c252a49710fb053bb9f2b933173ff9a7baad41d04514751e6851f5304fd243751703bed21b914f6be218c0fa354a341');
  //     pubkey.inspect().should.equal('<PublicKey: 041ff0fe0f7b15ffaa85ff9f4744d539139c252a49710fb053bb9f2b933173ff9a7baad41d04514751e6851f5304fd243751703bed21b914f6be218c0fa354a341, uncompressed>');
  //   });
  //
  //   it('should output known compressed pubkey for console', function() {
  //     var pubkey = PublicKey.fromString('031ff0fe0f7b15ffaa85ff9f4744d539139c252a49710fb053bb9f2b933173ff9a');
  //     pubkey.inspect().should.equal('<PublicKey: 031ff0fe0f7b15ffaa85ff9f4744d539139c252a49710fb053bb9f2b933173ff9a>');
  //   });
  //
  //   it('should output known compressed pubkey with network for console', function() {
  //     var privkey = PrivateKey.fromWIF('L3T1s1TYP9oyhHpXgkyLoJFGniEgkv2Jhi138d7R2yJ9F4QdDU2m');
  //     var pubkey = new PublicKey(privkey);
  //     pubkey.inspect().should.equal('<PublicKey: 30820408038204040080c00060081402f2ba4d72562ccd18c83799f09485d850d6742a2f0bcfe77e562cda9e9477c6692da963c814bbc14545edc3009f36db2f6bb669b1e8f5830b6a7865cb443fb88e02e57ac382e5c24147ccea49848966310655cda7632abb32638d27a5015a4a3a819fec8a5dff37d309a8228ee65a84c44e3012f0ff8c27454b601755096959d50f39c77de705e8ec075813343f55d43caeca7e3689a6a7fbe45558a1beb409dd033bdc7a1790cc0c11e4cddc0d3c410c5c328650cf6895390791240468fcfa91dbcf9dafdcf7b3d1e49bb5f4e36f9e5b81ca170c49185199bad117fb2dc341850f428faf172235e5869af8bc14ffee25920fa8bb030d316dcee0a60c6f1c37eac461d49277dfbf308fff74ead58b35df663ba18ede62e976ae81caeff83f29c5dbebe1dc5fa2f5f51b00260abd35964803e1ea4fffe299675c2f9ad1defc53c7171b97ec516084c92e44f72c4a4d820fb530be9e462e8af54efa99e46cc7c52a8c67bab064feca7c5d65d414859ce352ce463ce6932673ef92dec665a6f17cd43f1e27f63f8782a3058198d68c61153eb5936f0c89f2539aaa31f8fbffa45b25f65a6533c275010f5e4aef4dccc8aafc5f93682d9aab808419669d3914d35e493baa1b578884c375d0edbc8d697f434b83c8448d9bd750c8b7b903d8ea3b707d3f3cfd93085179bcb1b07ebaa0df0764d24dad80f9ece7bc42c0520c4f331f9531469088e542cbf8b44a668f15434ee7bec2f426fd2eac2e919f05b566e5047dbeb9d47c7f15d058e33b6441a4fcb64e7b7ce30a0aa1aae42218da7af12c19f45f55f392e4147b797e05dd7a08457d90a1285e6220fe6d93a4f42755ac1b45f32d9e6da12ae80b9dc0f9af7ec349ec28b513138fa75b7c4e74acda76f777e61a2ff66060ac64f86cbab7a98fd3ebddc558b8597493f5f1f4835f89b7b03ea087c56756928b7d373ad7d60ce4dfbaf0ebc0f38c61c76dc44f6927a77f7fe666f4979b311d52464a80853b687c1d702d12f3739ebbcbd4a0297396ea487bd6cf05786a2be4d9823ffce9963c8f4562a75b230da006fa22bbcb3214b378128706f76075d3e2abe44eb589709a3b594191df4a8bb954b55de0cfe90a91e7de80033782f11e17c6b11f64308cdfa2f543d360636e026d3a1d5f0754b3a199d9a81fb179230388b14d309028d5c08c2553289dad33ae7e7b25e6b01c6f6d70810830dc48717284735b57559958ee4de25bf8770c50c7eacac0d79562bb7dedd6fa4231a0dd3197aa8255e4d4321a8c04c1d940ea6c907e52489f23a2daef57454ac5be97315633b016d51ef84ad9648c2b451edbd691ccfd032c92b6dc5f77d67a27073e00eb720da072c896f784bd703b71195e2ce8e7121f40434555fa39d1f0beb8439499d120883127f508255927c9a50751f3011d693a34ceb0a67106>');
  //   });
  //
  // });
  //
  // describe('#validate', function() {
  //
  //   it('should not have an error if pubkey is valid', function() {
  //     var hex = '031ff0fe0f7b15ffaa85ff9f4744d539139c252a49710fb053bb9f2b933173ff9a';
  //     expect(function() {
  //       return PublicKey.fromString(hex);
  //     }).to.not.throw();
  //   });
  //
  //   it('should throw an error if pubkey is invalid', function() {
  //     var hex = '041ff0fe0f7b15ffaa85ff9f4744d539139c252a49710fb053bb9f2b933173ff9a0000000000000000000000000000000000000000000000000000000000000000';
  //     (function() {
  //       return PublicKey.fromString(hex);
  //     }).should.throw('Failed to match tag: "seq" at: (shallow)');
  //   });
  //
  //   it('should throw an error if pubkey is invalid', function() {
  //     var hex = '041ff0fe0f7b15ffaa85ff9f4744d539139c252a49710fb053bb9f2b933173ff9a00000000000000000000000000000000000000000000000000000000000000FF';
  //     (function() {
  //       return PublicKey.fromString(hex);
  //     }).should.throw('Failed to match tag: "seq" at: (shallow)');
  //   });
  //
  // });

});