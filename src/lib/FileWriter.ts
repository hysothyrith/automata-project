// save file to local computer as a .json file
export function saveFile(fileName: string, data: any) {
    const textToSave = JSON.stringify(data);
    const blob = new Blob([JSON.stringify(textToSave, null, 2)], {type : 'application/json'});
    const url = URL.createObjectURL(blob);
    const fileNameToDownload =  fileName + ".automaton"
    const a = document.createElement("a");
    a.href = url;
    a.download = fileNameToDownload;
    a.click();
    URL.revokeObjectURL(url);
}

// load file from local computer as a .json file
export function openFile() {
   var fileToLoad = document.getElementById("fileToLoad").files[0];
   let dfa = {};

    var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent) 
    {
        var textFromFileLoaded = fileLoadedEvent.target.result;
        const contentToObj = JSON.parse(textFromFileLoaded);
        console.log(contentToObj.symbols);
        document.getElementById("number_states").value = contentToObj.symbols;
        dfa.value = JSON.parse(contentToObj);
    };
    const content = fileReader.readAsText(fileToLoad, "UTF-8");
    return dfa;
}