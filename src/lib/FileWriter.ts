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
