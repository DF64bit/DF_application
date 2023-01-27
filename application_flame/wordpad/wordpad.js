var uploadButton = document.getElementById("upload");
uploadButton.addEventListener("click",
async (e)=>{
    var dirHandle = await window.showDirectoryPicker();

    const file = await dirHandle.getFileHandle(window.prompt("編集したいファイルの名前をファイル拡張子名も含めて入力してください※txtファイルしか読み込めません"));

    fileData = await file.getFile();
    var text = await fileData.text();
    document.getElementById("other").innerHTML = '<textarea id="content" name="content" rows="5" cols="33">' + text + '</textarea> <button id="save">保存</button>';
    document.getElementById("inuploadbutton").innerHTML = "";

    var saveButton = document.getElementById("save");
    saveButton.addEventListener("click",
    async (e)=>{
      const sampleConfig = document.getElementById("content").value;

      const blob = new Blob([sampleConfig], {
        type: "text/plain"
      });

      const writableStream = await file.createWritable();
      await writableStream.write(blob);
      await writableStream.close();
      window.alert("保存しました。 ");
      window.close();
    });
});
