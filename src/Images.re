[@bs.module] external src1 : string = "./images/1.gif";

[@bs.module] external src2 : string = "./images/2.jpg";

[@bs.module] external src4 : string = "./images/4.gif";

[@bs.module] external src5 : string = "./images/5.jpg";

[@bs.module] external src6 : string = "./images/6.jpg";

[@bs.module] external src7 : string = "./images/7.jpg";

[@bs.module] external src8 : string = "./images/8.jpg";

[@bs.module] external src9 : string = "./images/9.jpg";

[@bs.module] external src10 : string = "./images/10.jpg";

type image = {
  src: string,
  origin: string,
  author: string
};

let data = [|
  {
    src: src1,
    origin: "http://memory-dealer.tumblr.com/post/159603930761/e-n-t-r-o-p-y",
    author: "Memory Dealer"
  },
  {src: src2, origin: "https://www.pinterest.ca/pin/355714070559138155/", author: "Aaron Smith"},
  {src: src4, origin: "http://30000fps.com/post/158237586643", author: "30000fps"},
  {
    src: src5,
    origin: "http://magastrom.tumblr.com/post/140564618950",
    author: "Magnus Åström"
  },
  {src: src6, origin: "http://nicolereber.tumblr.com/post/112994588207", author: "Nicolerber"},
  {
    src: src7,
    origin: "http://design-milk.com/stone-fields-by-giuseppe-randazzo/",
    author: "Giuseppe Randazzo"
  },
  {src: src8, origin: "http://kevc.tumblr.com/post/159115819074", author: "Kevc"},
  {
    src: src9,
    origin: "https://www.theghostlystore.com/collections/art/products/michael-cina-biolumin-v-1#prettyPhoto",
    author: "Michael Cina"
  },
  {src: src10, origin: "http://www.mariasvarbova.com/swimmingpool-gnkl", author: "Maria Svarbova"}
|];
