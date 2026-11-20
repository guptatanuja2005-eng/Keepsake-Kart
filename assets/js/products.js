/* Categories shown on the Collections page. Categories with no products show "Coming soon". */
window.KK_CATS = [
  { name: "Hot Wheels", d: "Mainlines, premiums and everyday favourites." },
  { name: "Imported", d: "Malaysian and US imports you won\u2019t find on local shelves." },
  { name: "Bundles", d: "Value bundles with bonus cars." },
  { name: "Matchbox", d: "Everyday classics and movie editions." },
  { name: "LEGO", d: "Bricks and sets for builders and collectors." },
  { name: "Mini GT", d: "Precision-built, boxed, display-ready." },
  { name: "Bburago", d: "Supercars and scale models." },
  { name: "Majorette", d: "Colourful die-cast classics." },
  { name: "Pre-Orders", d: "Reserve upcoming drops before they land. Give a product the category \"Pre-Orders\" to list it here." }
];
/* Products: id, name, price (INR), category, in stock (1/0), car colour, optional 7th value = units in stock (a number).
   With a number, the shop shows "Only N left" and stops orders above N; qty 0 marks the product sold out.
   To use real photos add an images array to a product, e.g. images: ["assets/img/camaro10-1.jpg"]. */
/* Illustrative images (not photos of the actual products) in assets/img/products/<id>.jpg, used until real photos are added. */
var KK_ART = { camaro10: 1, corv11: 1, chall15: 1, batboat: 1, jag15: 1, mx5: 1, chiron16: 1, cadi16: 1, cent16: 1, audi17: 1, huayra17: 1, camaro18: 1, demon18: 1, raptor19: 1, merc19: 1, galaxie63: 1 };
window.KK_PRODUCTS = [
 ["camaro10","\u201910 Camaro SS \u2014 Malaysian Imported",299,"Imported",1,"#E0B13C"],
 ["corv11","\u201911 Corvette Grand Sport",199,"Hot Wheels",1,"#C23B3B"],
 ["chall15","\u201915 Dodge Challenger SRT + 2 Random Hot Wheels",540,"Bundles",1,"#8A5BD0"],
 ["batboat","1966 Bat Boat",250,"Hot Wheels",1,"#3A4A66"],
 ["jag15","\u201915 Jaguar F-Type Project 7 \u2014 Malaysian Imported",550,"Imported",0,"#3F9A6B"],
 ["mx5","\u201915 Mazda MX-5 Miata \u2014 Malaysian Imported",499,"Imported",0,"#C9A45C"],
 ["chiron16","\u201916 Bugatti Chiron (lil creased) \u2014 Malaysian Imported",799,"Imported",0,"#2F6FB5"],
 ["cadi16","\u201916 Cadillac ARS-VR",199,"Hot Wheels",0,"#9AA0A8"],
 ["cent16","\u201916 Lamborghini Centenario Roadster \u2014 US Imported",599,"Imported",0,"#D8741E"],
 ["audi17","\u201917 Audi RS 6 Avant",199,"Hot Wheels",0,"#4B5563"],
 ["huayra17","\u201917 Pagani Huayra Roadster & Pedal Driver \u2014 Imported",650,"Imported",0,"#B8453A"],
 ["camaro18","\u201918 Camaro SS",199,"Hot Wheels",0,"#1F7A8C"],
 ["demon18","\u201918 Dodge Challenger SRT Demon \u2014 US Imported",350,"Imported",0,"#7A1F2B"],
 ["raptor19","\u201919 Ford Ranger Raptor \u2014 Malaysian Imported",299,"Imported",0,"#5C6B3A"],
 ["merc19","\u201919 Mercedes-Benz A-Class",199,"Hot Wheels",0,"#C7C7CC"],
 ["galaxie63","1963 Ford Galaxie",180,"Hot Wheels",0,"#6B8FB5"]
].map(function (r) {
  var d = "Authentic 1:64 scale Hot Wheels die-cast car." +
    (r[3] === "Imported" ? " Imported edition, a sought-after pick for collectors." : "") +
    (r[3] === "Bundles" ? " Bundle deal: the named car plus 2 random Hot Wheels." : "") +
    (r[0] === "chiron16" ? " Note: the card has a slight crease, as stated in the title." : "");
  var q = typeof r[6] === "number" ? r[6] : null;
  return { id: r[0], name: r[1], price: r[2], cat: r[3], brand: "Hot Wheels", qty: q, art: KK_ART[r[0]] ? "assets/img/products/" + r[0] + ".jpg" : "", stock: !!r[4] && (q === null || q > 0), color: r[5], desc: d };
});
