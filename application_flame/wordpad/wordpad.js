var uploadButton = document.getElementById("upload");
uploadButton.addEventListener("click",
(e)=>{
    var dh = window.showDirectoryPicker();
    var fh = dh.getFileHandle(window.prompt("このフォルダ内で編集したいファイルの名前を入力してください（ファイル拡張子名も含めて）"));
    var file = fh.getFile();
    var content = file.text();
    var content = window.prompt("テキストファイルに書き込みたいテキストを入力してください。");
    var stream = fh.createWritable();
    stream.write(content);
    stream.close();
})