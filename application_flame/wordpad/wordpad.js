var uploadButton = document.getElementById("upload");
uploadButton.addEventListener("click",
(e)=>{
    var dirHandle = await window.showDirectoryPicker();

    const file = await dirHandle.getFileHandle(window.prompt("編集したいファイルの名前をファイル拡張子名も含めて入力してください(txtファイルしか読み込めません)"));

    const sampleConfig = window.prompt("このファイルの内容を何に変更しますか?");

    const blob = new Blob([sampleConfig], {
      type: "text/plain"
    });

    const writableStream = await file.createWritable();
    await writableStream.write(blob);
    await writableStream.close();
    window.alert("保存しました。 ");
})