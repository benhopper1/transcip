var AjaxJsonPostObject = function(inData){
    var aSync = true;
    var method = 'post';
    var url;
    var function_onSuccess;
    var function_onFail;
    
    if(inData.url){url = inData.url;}
    if(inData.onSuccess){function_onSuccess = inData.onSuccess;}
    if(inData.onFail){function_onFail = inData.onFail;}

    var xhr = new XMLHttpRequest();

    this.send = function(inData){
        console.log('sending');
        xhr.open(method, url, aSync);

        xhr.onload = function(e){
            if (xhr.readyState === 4){
                if(xhr.status === 200){
                    if(function_onSuccess){function_onSuccess(xhr.responseText);}
                }else{
                    if(function_onFail){function_onFail(e, xhr.statusText);}
                }
            }
        };

        xhr.onerror = function(e){
            if(function_onFail){function_onFail(e, xhr.statusText);}
        };

        xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
        xhr.send(JSON.stringify(inData));
    }

}


var AjaxPostObject = function(){
    this.uploadFileAndData = function(inFileElementId, inHashOfData, onFinish){
        var client = new XMLHttpRequest();

        client.onreadystatechange = function() {
            if (client.readyState == 4 && client.status == 200){
                if(onFinish){
                    onFinish(client.responseText);
                }
            }
        }

        var file = document.getElementById(inFileElementId);
        var formData = new FormData();
        console.log(JSON.stringify(file.files[0]));
        formData.append("uploadedFile", file.files[0]);

        for(key in inHashOfData){
           formData.append(key, inHashOfData[key]);
        }

        client.open("post", "/upload", true);
        client.send(formData);
    }
}


