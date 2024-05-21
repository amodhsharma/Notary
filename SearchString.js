//load book from disk
function loadBook(filename,displayName){
    let currentBook = "";
    //creating a new folder called books in which we have put the text versions of our books
    let url ="books/" + filename;

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
            //as browsers dont recognize it 
            //replace takes in regular expressions
            currentBook = currentBook.replace(/(?:\r\n|\r|\n)/g, '<br>');

            document.getElementById("fileContent").innerHTML = currentBook;

            //after changing books, the below code allows you to move to the top of the book text content
            var elmnt = document.getElementById("fileContent");
            elmnt.scrollTop = 0;

        }
    };
}

//function to get stats for book
//uses regular expression
function getDocStats(fileContent) {

    var docLength = document.getElementById("docLength");
    //selects html element with id docLength and is useed to manipulate it later through js
    var wordCount = document.getElementById("wordCount");
    var charCount = document.getElementById("charCount");

    let text = fileContent.toLowerCase();   //converting all content of fileContent to lower case and stores it in text
    let wordArray = text.match(/\b\S+\b/g); //using a regular expression to find words and make an array where each element is a word from the text
    let wordDictionary = {};        //creates an empty dictionary 
    //technically dictionaries dont exist in js, this is an object but we will treat it like a dictionary
    //in this dictionary, we are going to count the number of word
    //definition - a dictionary holds multipple key-value pairs 
    //hence in this dictionary we are going to store the word and the occurance of that word in the text imported 


    var uncommonWords = [];

    //filter out the uncommon words
    uncommonWords = filterStopWords(wordArray);


    //Count every word in the wordArray
    //continuation of dictionary
    for (let word in uncommonWords) {
        let wordValue = uncommonWords[word];
        if (wordDictionary[wordValue] > 0) {    //we know that the word exists 
            wordDictionary[wordValue] += 1;     //hence we add word 
        } else {
            wordDictionary[wordValue] = 1;      //opposed to when we see it for the firs time, we make its occurance 1 
        }
    }

    //sort the array based on the value we are getting on the sort property function
    let wordList = sortProperties(wordDictionary);

    //Return the top 5 words
    var top5Words = wordList.slice(0, 6);
    //slice function used to extract elements from arrays
    //start number (0) refers to the first beginning element of the word list and is included during slicing, whereas the last number isnt 
    //so 0,6 means 0 index, 1 index, 2 index, 3 index, 4 index, 5 index and end 
//DOUBT - SHOULDNT IT BE TILL 0,5?

    //return the least 5 words
    var least5Words = wordList.slice(-6, wordList.length);
//DOUBT I THINK THIS IS WRONG, AS IT WILL RETURN 6 ELEMENTS NOT 5 
    //starting from 5th last element 
//DOUBT - wordlist.length gives the last number, but uaually it is non incluseive, so shouldnt we add 1 to it ?

    //Write the values to the page
    //UL Template is a function

    //DOUBT - What is happening in the following code 
    ULTemplate(top5Words, document.getElementById("mostUsed"));
    ULTemplate(least5Words, document.getElementById("leastUsed"));

    //metrics for the document stats bottom right box 
    docLength.innerText = "Document Length: " + text.length;
    wordCount.innerText = "Word Count: " + wordArray.length;

}

//DOUBT - idk what is happening in this element 
function ULTemplate(items, element) {
    let rowTemplate = document.getElementById('template-ul-items');
    let templateHTML = rowTemplate.innerHTML;
    let resultsHTML = "";

    for (i = 0; i < items.length - 1; i++) {    //iterates through all items except the last one
        resultsHTML += templateHTML.replace('{{val}}', items[i][0] + " : " + items[i][1] + " time(s)");
        /*
        For each item, the placeholder {{val}} in the templateHTML is replaced with a string 
        formed by concatenating the first element of the item (items[i][0]), a colon and space 
        (" : "), the second element of the item (items[i][1]), and the string " time(s)".
        The result is appended to resultsHTML.
        */
    }

    element.innerHTML = resultsHTML;

}

//function to sort this dictionary in a way that we get the most used words and least used words
function sortProperties(obj) {      //treating array/dictionary as object 
    //using a comparing function
    //first convert the object to an array
    let rtnArray = Object.entries(obj);

    //Sort the array
    rtnArray.sort(function (first, second) {    //called a comparing function
        /* behavior of comparing function for understanding below code 
        second[1] - first[1]: This calculates the difference between the second element of second and the second element of first.
        If second[1] is greater than first[1], the result will be positive, meaning second should come before first.
        If second[1] is less than first[1], the result will be negative, meaning first should come before second.
        If they are equal, the result will be zero, meaning their order will remain unchanged relative to each other.

        the number with the highest value comes first and the next immediate less will be next
        */
        return second[1] - first[1];
    });

    return rtnArray;

}

//filter out stop words
function filterStopWords(wordArray) {
    var commonWords = getStopWords();
    var commonObj = {};
    //curly brakcets used for objects 
    var uncommonArr = [];
    //square brackets used for arrays


    for (i = 0; i < commonWords.length; i++) {
        commonObj[commonWords[i].trim()] = true;
    }
    //trim is used to remove whitespaces

    for (i = 0; i < wordArray.length; i++) {
        word = wordArray[i].trim().toLowerCase();
        if (!commonObj[word]) {
            uncommonArr.push(word);
            //will push unique/uncommon words into array  
        }
    }

    return uncommonArr;
}

//a list of stop words we don't want to include in stats
function getStopWords() {
    return ["a", "able", "about", "across", "after", "all", "almost", "also", "am", "among", "an", "and", "any", "are", "as", "at", "be", "because", "been", "but", "by", "can", "cannot", "could", "dear", "did", "do", "does", "either", "else", "ever", "every", "for", "from", "get", "got", "had", "has", "have", "he", "her", "hers", "him", "his", "how", "however", "i", "if", "in", "into", "is", "it", "its", "just", "least", "let", "like", "likely", "may", "me", "might", "most", "must", "my", "neither", "no", "nor", "not", "of", "off", "often", "on", "only", "or", "other", "our", "own", "rather", "said", "say", "says", "she", "should", "since", "so", "some", "than", "that", "the", "their", "them", "then", "there", "these", "they", "this", "tis", "to", "too", "twas", "us", "wants", "was", "we", "were", "what", "when", "where", "which", "while", "who", "whom", "why", "will", "with", "would", "yet", "you", "your", "ain't", "aren't", "can't", "could've", "couldn't", "didn't", "doesn't", "don't", "hasn't", "he'd", "he'll", "he's", "how'd", "how'll", "how's", "i'd", "i'll", "i'm", "i've", "isn't", "it's", "might've", "mightn't", "must've", "mustn't", "shan't", "she'd", "she'll", "she's", "should've", "shouldn't", "that'll", "that's", "there's", "they'd", "they'll", "they're", "they've", "wasn't", "we'd", "we'll", "we're", "weren't", "what'd", "what's", "when'd", "when'll", "when's", "where'd", "where'll", "where's", "who'd", "who'll", "who's", "why'd", "why'll", "why's", "won't", "would've", "wouldn't", "you'd", "you'll", "you're", "you've"];
}

//used to mark document up and insert html and highlight words in search

function performMark() {    //This function is used to perform the search query for a specific word inputted by the user and returns the number of times it was found

    //read the keyword
    var keyword = document.getElementById("keyword").value;
    //extracting value 
    var display = document.getElementById("fileContent");
    //getting the book

    var newContent = "";

    //find all the currently marked items
    let spans = document.querySelectorAll('mark');  //will find all tags which are defined as <mark> </mark>

    //<mark>Harry</mark> = outer html 
    //Harry = inner html


    for (var i = 0; i < spans.length; i++) {    //goes till last elements in spans
        spans[i].outerHTML = spans[i].innerHTML;    //this function achieved the inner html from the outer html
    }

    var re = new RegExp(keyword, "gi");
    //dumberdore and Dumbledore both will be found - meaning of case insensitive 
    
    //keyword is the input made by the user 
    //gi means global and case insensitive 
    var replaceText = "<mark id='markme'>$&</mark>";        //DOUBT - what is happening here
    var bookContent = display.innerHTML;

    //add the mark to the book content
    newContent = bookContent.replace(re, replaceText);      //DOUBT - what is happening here 

    display.innerHTML = newContent;     //replacing content
    var count = document.querySelectorAll('mark').length;
    //querySelectorAll is an inbuilt function returns all eleemnts that match the selector
    document.getElementById("searchstat").innerHTML = "found " + count + " matches";

    if (count > 0) {        //scrolling to the first element found
        var element = document.getElementById("markme");
        element.scrollIntoView();   //scroll into view inbuilt function
    };
}
