//load book from disk
function loadBook(filename,displayName){
    let currentBook = "";
    //creating a new folder called books in which we have put the text versions of our books
    let url ="books/"+filename;

    //resetting the ui everytime a new book is clicked on 
    document.getElementById("fileName").innerHTML = displayName;
    document.getElementById("searchstat").innerHTML = "";
    document.getElementById("keyword").value = "";

    //creating a server request to load our books as in a website, data will be stored on a server 
    //and not locally 
    //hence we have to start a http request 
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);     //getting the input from the server
    //happening in asychronous? that is why we are using true?
    xhr.send();         //to initiate network traffic

    //to check if it is completed
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) { //ready state tells us what is going on with the request, like its state
            //it can have 4 states
            //0 -> unsent 
            //1 ->doc/file is not opened
            //2-> recieved headers or recieved info about the request 
            //3->loading the file bac 
            //4->process done 
            //we want to proceed further when ready state is at 4 i.e process is done

            currentBook = xhr.responseText;
            //this means that we can get the response/load the contents into the currentBook variable

            getDocStats(currentBook);

            //remove line breaks and carriage returns and replace with a <br>
            currentBook = currentBook.replace(/(?:\r\n|\r|\n)/g, '<br>');

            document.getElementById("fileContent").innerHTML = currentBook;

            //after changing books, the below code allows you to move to the top of the book text content
            var elmnt = document.getElementById("fileContent");
            elmnt.scrollTop = 0;

        }
    };
}