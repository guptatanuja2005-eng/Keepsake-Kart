/* Categories shown on the Collections page. Categories with no products show "Coming soon". */
window.KK_CATS = [
  { name: "Hot Wheels", d: "Mainlines, premiums and everyday favourites." },
  { name: "Imported", d: "Malaysian and US imports you won’t find on local shelves." },
  { name: "Bundles", d: "Value bundles with bonus cars." },
  { name: "Matchbox", d: "Everyday classics and movie editions." },
  { name: "LEGO", d: "Bricks and sets for builders and collectors." },
  { name: "Mini GT", d: "Precision-built, boxed, display-ready." },
  { name: "Bburago", d: "Supercars and scale models." },
  { name: "Majorette", d: "Colourful die-cast classics." }
];
/* Products: id, name, price (INR), category, in stock (1/0), car colour.
   To use real photos add an images array to a product, e.g. images: ["assets/img/camaro10-1.jpg"]. */
window.KK_PRODUCTS = [
 ["camaro10","’10 Camaro SS — Malaysian Imported",299,"Imported",1,"#E0B13C"],
 ["corv11","’11 Corvette Grand Sport",199,"Hot Wheels",1,"#C23B3B"],
 ["chall15","’15 Dodge Challenger SRT + 2 Random Hot Wheels",540,"Bundles",1,"#8A5BD0"],
 ["batboat","1966 Bat Boat",250,"Hot Wheels",1,"#3A4A66"],
 ["jag15","’15 Jaguar F-Type Project 7 — Malaysian Imported",550,"Imported",0,"#3F9A6B"],
 ["mx5","’15 Mazda MX-5 Miata — Malaysian Imported",499,"Imported",0,"#C9A45C"],
 ["chiron16","’16 Bugatti Chiron (lil creased) — Malaysian Imported",799,"Imported",0,"#2F6FB5"],
 ["cadi16","’16 Cadillac ARS-VR",199,"Hot Wheels",0,"#9AA0A8"],
 ["cent16","’16 Lamborghini Centenario Roadster — US Imported",599,"Imported",0,"#D8741E"],
 ["audi17","’17 Audi RS 6 Avant",199,"Hot Wheels",0,"#4B5563"],
 ["huayra17","’17 Pagani Huayra Roadster & Pedal Driver — Imported",650,"Imported",0,"#B8453A"],
 ["camaro18","’18 Camaro SS",199,"Hot Wheels",0,"#1F7A8C"],
 ["demon18","’18 Dodge Challenger SRT Demon — US Imported",350,"Imported",0,"#7A1F2B"],
 ["raptor19","’19 Ford Ranger Raptor — Malaysian Imported",299,"Imported",0,"#5C6B3A"],
 ["merc19","’19 Mercedes-Benz A-Class",199,"Hot Wheels",0,"#C7C7CC"],
 ["galaxie63","1963 Ford Galaxie",180,"Hot Wheels",0,"#6B8FB5"]
].map(function (r) {
  var d = "Authentic 1:64 scale Hot Wheels die-cast car." +
    (r[3] === "Imported" ? " Imported edition, a sought-after pick for collectors." : "") +
    (r[3] === "Bundles" ? " Bundle deal: the named car plus 2 random Hot Wheels." : "") +
    (r[0] === "chiron16" ? " Note: the card has a slight crease, as stated in the title." : "");
  return { id: r[0], name: r[1], price: r[2], cat: r[3], brand: "Hot Wheels", stock: !!r[4], color: r[5], desc: d };
});
