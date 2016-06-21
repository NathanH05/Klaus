


//var sel = document.getElementById('typeSelect');


function preparePage() {
	// used throughout the examples below

// used throughout the examples below
var sel = document.getElementById('typeSelect');
var saleLabel =document.getElementById("sally");
                                      


if (sel.selectedIndex == "0"){
saleLabel.style.display="none";
  
}
else{
  saleLabel.style.display="inline-block";

}  
//};
//console.log(sel.selectedIndex);
	
}
document.getElementById('typeSelect').onchange = "preparePage(this);"
