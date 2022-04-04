

// var userId = "none";


function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}



var userId = getCookie('imaginaries_user_id');
// alert(userId);
if (!userId) {
    // alert(here);
    userId = String(Math.floor(Math.random() * 10000000000));
    setCookie('imaginaries_user_id', userId, 365);    
}

document.getElementById('userId').innerHTML +=  "User ID: "  + userId;



function refreshImages_1() {

  var xhr = new XMLHttpRequest();
  xhr.open("GET", "http://127.0.0.1:5000/control_set_images_1/"+userId, true);
  // xhr.responseType = 'document';
  xhr.onreadystatechange = function() {
    if (this.readyState == 4) {
      var res = this.responseText;
      document.getElementById('container_1').innerHTML =  res;        
    }
  };
  xhr.send();

}
refreshImages_1();


function refreshImages_2() {

  var xhr = new XMLHttpRequest();
  xhr.open("GET", "http://127.0.0.1:5000/control_set_images_2/"+userId, true);
  // xhr.responseType = 'document';
  xhr.onreadystatechange = function() {
    if (this.readyState == 4) {
      var res = this.responseText;
      document.getElementById('container_2').innerHTML =  res;        
    }
  };

  xhr.send();
}
refreshImages_2();

function submitImages_1(){
    document.getElementById('upload_images_1').action = 'http://localhost:5000/uploader_1/'+userId;
    document.getElementById('upload_images_1').submit();
    refreshImages_1();
}

function submitImages_2(){
    document.getElementById('upload_images_2').action = 'http://localhost:5000/uploader_2/'+userId;
    document.getElementById('upload_images_2').submit();
    refreshImages_2();
}

$('.file_upload_1_new_Btn').click(function() {
  $('#file_upload_1').click();
});


$('.file_upload_2_new_Btn').click(function() {
  $('#file_upload_2').click();
});

$('.default_gender').click(function() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "http://127.0.0.1:5000/revert_default_gender/"+userId, true);
  xhr.onreadystatechange = function() {
    if (this.readyState == 4) {
      var res = this.responseText;
      refreshImages_1();
      refreshImages_2();
    }
  };

  xhr.send();  


});


// document.getElementById("file_upload_1").onchange = function() {
//     document.getElementById("upload_images_1").submit();
// };


// document.addEventListener('DOMContentLoaded', function() {
//     var link = document.getElementById('button_control_set');
//     // onClick's logic below:
//     link.addEventListener('click', function() {
// 	    const path = ['file:///Users/vijaykeswani/Research/Control%20Set%20Audit/Plugin%20Code/Control_alt/'];

// 	    for (let i = 1; i <= 20; i++) {
// 	        var link = path+String(i)+".jpg";
// 	        document.getElementById('container').innerHTML += `<div class="grid-item">
// 	        <img src=${link} width=50 />
// 	        </div>`;
// 	      }
//     });
// });



// document.addEventListener('DOMContentLoaded', function() {
//     var link = document.getElementById('second_button');
//     // onClick's logic below:
//     link.addEventListener('click', function() {
//         location.href = 'results.html';
//     });
// });




// modifyInputs();


// const path = ['file:///Users/vijaykeswani/Research/Control%20Set%20Audit/Plugin%20Code/Control_alt/'];

// for (let i = 1; i <= 20; i++) {
//   var link = path+String(i)+".jpg";
//   document.getElementById('container').innerHTML += `<div class="grid-item">
//   <img src=${link} width=50 />
//   </div>`;
// }





// // function getQuery() {
// url = location.search;
// var query = url.substr(1);
// var result = {};
// query.split("&").forEach(function(part) {
// var item = part.split("=");
// result[item[0]] = decodeURIComponent(item[1]);
// });
// var res = result;
// var q = res['q'];
//   // console.log(q + "asdasd");
//   // return q;
// // }
// // console.log(q);

// // text = document.getElementById("txt");
// // text.textContent = "Calculating";

// // function showText(){
//   // var q = getQuery();
// var req = new XMLHttpRequest();
// req.open("GET", "http://localhost/repcheck.py/"+q,true);
// req.onload = function() {
//   message = req.response.toString() + " - response";
//   // console.log(message);
//   const res = req.response;
//   // text.textContent = res;
//   document.cookie = "res=" + res;
//   // console.log(document.cookie);
// }
// req.onerror = function(){
//   console.log("error : ",this.error);
// }
// req.send();



// // alert(query);


// // console.log(document.cookie);
// // console.log(getCookieVal("query"));

// let q = getQuery();
// document.cookie =  "q="+String(q);

// // var loc = "http://localhost:5000/repcheck.py/"+query;
// // alert(loc);
// // document.open();
// // let x = document.cookie;
// // console.log('<a href=http://localhost:5000/repcheck.py/' + query + '>Process query</a>');

// let x = '<a href="http://localhost:5000/repcheck.py/' + q + '">Process query</a>';
// console.log(x);
// // let x = 'http://localhost:5000/repcheck.py/' + getCookieVal("query");
// document.write(x); 




// function showText() {
//  let q = getQuery();
//  // let x = '<a href="http://localhost:5000/repcheck.py/' + q + '">Process query</a>';
//  console.log('http://localhost:5000/repcheck.py/' + q);
//  $.get('http://localhost:5000/repcheck.py/' + q, function(data,status) {
//       text.textContent = data;
//  },'html');

//     count++;
//     // text.textContent = "Times clicked: " + count;
// }




// var count = 0,
// button = document.getElementById("btn"),


// button.addEventListener("click", showText);




// var node = document.getElementById('link');
// node.href = x;
// document.body.appendChild(node);

// document.write(['<a href="http://localhost:5000/repcheck.py/',query,'">Process query</a>'].join(''));
// document.close();


// }

// showText();

// let p = document.createElement("p");
// p.textContent = "This paragraph was added by a page script.";
// p.setAttribute("id", "page-script-para");
// document.body.appendChild(p);

// // define a new property on the window
// window.foo = "This global variable was added by a page script";

// // redefine the built-in window.confirm() function
// window.confirm = function() {
//   alert("The page script has also redefined 'confirm'");
// }


// let myPort = browser.runtime.connect({name:"port-from-cs"});
// myPort.postMessage({greeting: "hello from content script"});

// myPort.onMessage.addListener(function(m) {
//   console.log("In content script, received message from background script: ");
//   console.log(m.greeting);
// });

// document.body.addEventListener("click", function() {
//   myPort.postMessage({greeting: "they clicked the page!"});
// });


// let createData = {
//   type: "detached_panel",
//   url: "call.html",
//   width: 250,
//   height: 100
// };
// let creating = browser.windows.create(createData);


// images = document.querySelectorAll("img");
// count = 0
// for (i of images) {
//     count = count + 1;
//      if (count > 70) {
//       break;
//     }

//     var a = document.createElement('a');
//     a.href = i.src;
//      console.log(i.height)
//     if (i.height > 150) {
//       // a.download = "repcheck_" + (count) + ".jpg";
//       // console.log(a);
//       // document.body.appendChild(a);
//       // a.click();
//       // document.body.removeChild(a);
//     }
// }

// $.getJSON('http://localhost:5000/test.py', 
//     function(data, textStatus, jqXHR) {
//         alert(data);
//     }
// )