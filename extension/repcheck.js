
// Components.utils.import("resource://gre/modules/Console.jsm");

var userId = "none";



function logCookie(cookie) {
  // if (cookie.value) {
    userId = cookie.value;
    // alert(userId);
    console.log(userId);
    document.getElementById('userId').innerHTML +=  "User ID: "  + (userId);    
  // }
}

function getCookie(tabs) {

  var getting = browser.cookies.get({
    url: "http://localhost:5000/control_set",
    // url: "http://3.145.25.123:8080/control_set",
    name: "imaginaries_user_id"
  });
  getting.then(logCookie);
}

var getActive = browser.tabs.query({
  active: true,
  currentWindow: true
});
getActive.then(getCookie);


document.addEventListener('DOMContentLoaded', function() {
    var link = document.getElementById('first_button');
    link.addEventListener('click', function() {
        location.href = 'control_set.html';


    });

});



var googleQuery;

browser.tabs.query({currentWindow: true, active: true})
  .then((tabs) => {
    url = tabs[0].url
    var query = url.split("?")[1];
    var result = {};
    query.split("&").forEach(function(part) {
    var item = part.split("=");
      result[item[0]] = decodeURIComponent(item[1]);
    });
    var res = result;
    googleQuery = res['q'].trim();

    // document.getElementById('queryCookie').innerHTML +=  "Current Search Query: <b>"  + googleQuery.replace("+", " ") + "</b>";
    document.getElementById('queryCookie_text').value =  googleQuery.replaceAll("+", " ").trim();

});




document.addEventListener('DOMContentLoaded', function() {
    var link = document.getElementById('button_control_set');
    link.addEventListener('click', function() {
	    var path = ['Control_alt/Group_1/'];

	    document.getElementById('container_1').innerHTML = "";
	    for (let i = 1; i <= 10; i++) {
	        var link = path+String(i)+".jpg";
	        document.getElementById('container_1').innerHTML += `<div class="grid-item">
	        <img src=${link} width=50 />
	        </div>`;
	      }
	    var path = ['Control_alt/Group_2/'];

	    document.getElementById('container_2').innerHTML = "";
	    for (let i = 1; i <= 9; i++) {
	        var link = path+String(i)+".jpg";
	        document.getElementById('container_2').innerHTML += `<div class="grid-item">
	        <img src=${link} width=50 />
	        </div>`;
	      }

	      document.getElementById('group_1_text').style.display = 'block';
	      document.getElementById('group_2_text').style.display = 'block';
	      document.getElementById('control_set_tooltiptext').style.visibility = 'visible';

    });
});



document.addEventListener('DOMContentLoaded', function() {
    var link = document.getElementById('second_button');
    // onClick's logic below:
    link.addEventListener('click', function() {
        location.href = 'results.html';
    });
});



function saveQuery (form) {
	q =form.query.value;
	document.cookie = "query=" + q;
	console.log(document.cookie);
}


function googleLink() {
  qq = query.replace(' ', '+');
  link = "https://www.google.com/search?tbm=isch&q=" + qq;
  // location.href = link;
  window.open(link, '_blank');
}


function modifyOffset() {
  var el, newPoint, newPlace, offset, siblings, k;
  width    = this.offsetWidth;
  newPoint = (this.value - this.getAttribute("min")) / (this.getAttribute("max") - this.getAttribute("min"));
  offset   = -1;
  if (newPoint < 0) { newPlace = 0;  }
  else if (newPoint > 1) { newPlace = width; }
  else { newPlace = width * newPoint + offset; offset -= newPoint;}
  siblings = this.parentNode.childNodes;
  for (var i = 0; i < siblings.length; i++) {
    sibling = siblings[i];
    if (sibling.id == this.id) { k = true; }
    if ((k == true) && (sibling.nodeName == "OUTPUT")) {
      outputTag = sibling;
    }
  }
  outputTag.style.left       = newPlace + "px";
  outputTag.style.marginLeft = offset + "%";
  outputTag.innerHTML        = this.value;
}

function modifyInputs() {
    
  var inputs = document.getElementsByTagName("input");
  for (var i = 0; i < inputs.length; i++) {
    if (inputs[i].getAttribute("type") == "range") {
      inputs[i].onchange = modifyOffset;

      // the following taken from http://stackoverflow.com/questions/2856513/trigger-onchange-event-manually
      if ("fireEvent" in inputs[i]) {
          inputs[i].fireEvent("onchange");
      } else {
          var evt = document.createEvent("HTMLEvents");
          evt.initEvent("change", false, true);
          inputs[i].dispatchEvent(evt);
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', function() {
    var link = document.getElementById('results_button');
    link.addEventListener('click', function() {
      processQuery();
    });

});

document.addEventListener('DOMContentLoaded', function() {
    var link = document.getElementById('wrapper');
    var info_page = document.getElementById('info_page');
    var main_page = document.getElementById('main_page');
    var icon = document.getElementById('block2');

    link.addEventListener('click', function() {
      if (main_page.style.display == 'block') {
        info_page.style.display = 'block';
        main_page.style.display = 'none';
        icon.innerHTML = '<p style="text-align: right; font-size: 20px"> &#10006; </p>';        
      }
      else {
        info_page.style.display = 'none';
        main_page.style.display = 'block';
        icon.innerHTML = '<p style="text-align: right; font-size: 20px"> &#9432; </p>';
      }
    });

});

document.addEventListener('DOMContentLoaded', function() {
    var link = document.getElementById('back_main_page');
    link.addEventListener('click', function() {
      var info_page = document.getElementById('info_page');
      var main_page = document.getElementById('main_page');
      var icon = document.getElementById('block2');
      info_page.style.display = 'none';
      main_page.style.display = 'block';
      icon.innerHTML = '<p style="text-align: right; font-size: 20px"> &#9432; </p>';
    });

});



document.addEventListener('DOMContentLoaded', function() {
    var link = document.getElementById('queryCookie_text');
    link.addEventListener('change', function() {
      googleQuery = link.value;
    });

});






function logLoadingCookie(cookie) {
  if (cookie.value) {
    gq = cookie.value;
    console.log(gq);
    document.getElementById('queryCookie_text').value =  gq.replaceAll("+", " ").trim();
    googleQuery = gq;

    // document.getElementById("results_button").click();
    processQuery();

  }
}

function getLoadingCookie(tabs) {

  var getting = browser.cookies.get({
    url: "http://localhost:5000/control_set",
    // url: "http://3.145.25.123:8080/control_set",
    name: "imaginaries_loading"
  });
  getting.then(logLoadingCookie);
}

var getActive = browser.tabs.query({
  active: true,
  currentWindow: true
});
getActive.then(getLoadingCookie);


function setLoadingCookie(tabs) {
  browser.cookies.set({
    url: "http://localhost:5000/control_set",
    // url: "http://3.145.25.123:8080/control_set",
    name: "imaginaries_loading",
    value: googleQuery
  });
}


function onRemoved(cookie) {
  console.log(`Removed: ${cookie}`);
  // alert("here");
}

function onError(error) {
  console.log(`Error removing cookie: ${error}`);
}

function removeLoadingCookie(tabs) {
  var removing = browser.cookies.remove({
    url: "http://localhost:5000/control_set",
    // url: "http://3.145.25.123:8080/control_set",
    name: "imaginaries_loading"
  });
  removing.then(onRemoved, onError);
}



function reqListener () {
  console.log(this.responseText);
}

function processQuery () {
  document.getElementById("results_button").value = 'Checking Representation in Results.... ';

  document.getElementById("loading").innerHTML = 'Processing images for this query will take around 2-3 minutes. The computation time involves fetching the images, extracting their features, and comparing them with the representative samples. We will store the results for this query if you want to come back to check them in a few minutues';
  document.getElementById('loading').style.display = 'block';

  if (!googleQuery) {
    document.getElementById("loading").innerHTML =  "Please enter a query or navigate to Google Image results tab";  
    document.getElementById("results_button").value = 'Check Representation in Search Results ';
    return;
  }


  var reqFlag = 0;

    var req = new XMLHttpRequest();
    req.addEventListener("load", reqListener);
    req.open("GET", "http://127.0.0.1:5000/repcheck.py/"+googleQuery+"/"+userId,true);
    // req.open("GET", "http://3.145.25.123:8080/repcheck.py/"+googleQuery+"/"+userId,true);
    req.onreadystatechange = function() {
      if (this.readyState == 4) {
        var res = this.responseText;
        // alert(res);
        if (res == "loading") {
          var getActive = browser.tabs.query({
            active: true,
            currentWindow: true
          });
          getActive.then(setLoadingCookie);
        } 
        else {

          // alert("here");
          var getActive = browser.tabs.query({active: true, currentWindow: true});
          getActive.then(removeLoadingCookie);          

          reqFlag = 1;
          document.getElementById('results_section').style.display = 'block';      
          document.getElementById('results').innerHTML =  "Computed Representation Score: "  + res;        
          var res2 = parseFloat(res);
          var val = (res2 * 100 + 100)/2;       
          // document.getElementById('results-slide').value = val;

          var left = 40 + (300)*val/100;
          document.getElementById('results-slide-3').style.left = String(left)+"px";

          document.getElementById('loading').style.display = 'none';

          document.getElementById("results_button").value = 'Check Representation in Search Results ';
          document.getElementById('results-slide-3').style.display = 'block';
          document.getElementById('results-slide-2').style.display = 'block';

          document.getElementById('slider-tooltiptext').style.visibility = 'visible';
          document.getElementById('slider-tooltiptext-2').style.visibility = 'visible';

          var score = "Score "  + res;   
          if (res2 < -0.25) {
            document.getElementById('slider-tooltiptext-2').innerHTML =  score + " implies <b>significant under-representation</b> of group 1";
          }
          if (res2 > -0.25 && res < 0) {
            document.getElementById('slider-tooltiptext-2').innerHTML =  score + " implies <b>slight under-representation</b> of group 1";
          }
          if (res2 > 0.25) {
            document.getElementById('slider-tooltiptext-2').innerHTML =  score + " implies <b>significant over-representation</b> of group 1";
          }
          if (res2 < 0.25 && res > 0) {
            document.getElementById('slider-tooltiptext-2').innerHTML =  score + " implies <b>slight over-representation</b> of group 1";
          }



        }




      }
    };
    req.send();

    req.onerror = function(){
      console.log("error : ",this.error);
    }
    req.send();
  

} 






