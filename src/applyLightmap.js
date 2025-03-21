// const texture = new RGBELoader().load('/lightmap-test.hdr', function(texture, dataTexture) {
//     texture.channel = 1;
//     texture.flipY = false;
// });
const texture = new TextureLoader().load('/lightmap-test.jpg', function(texture, dataTexture) {
    texture.channel = 1;
    texture.flipY = false;
});