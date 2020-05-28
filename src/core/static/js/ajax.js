const doAjax = (actionPath, data, action) => {
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", actionPath, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    // Force return to be JSON NOTE: Use application/xml to force XML
    xhttp.overrideMimeType('application/json');
    xhttp.send(data);
}

const formatURL = (basePath) => {
    url = window.location.href;
    if ( url.endsWith('/') )
        return url + basePath;
    else
        return url + '/' + basePath;
}

const fetchData = async (url) => {
    let response = null;
    response = await fetch(url);
    return await response.json();
}
