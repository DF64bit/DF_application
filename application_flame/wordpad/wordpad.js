var uploadButton = document.getElementById("upload");
uploadButton.addEventListener("click",
async (e)=>{
  const dirHandle = await window.showDirectoryPicker();
  console.log(dirHandle);

  document.getElementById("other").innerHTML = "開いてるファイルが無い<button id='opfile'>ファイルを開く</button>";
  document.getElementById("inuploadbutton").innerHTML = "";
  document.getElementById("opfile").addEventListener("click",
  async (e)=>{
    openfile();
  });

  async function openfile (){
    var files = [] ;
    for await (var handle of dirHandle.values()) {
      if (handle.kind === 'file') {
        files.push(handle.name);
      } else if (handle.kind === 'directory') {
        files.push(handle.name + '/');
      }
    };
    console.log(files);
    console.log(dirHandle.values());
    var selectreadfilebutton = "";
    for (var i = 0;i < files.length;i++){
      selectreadfilebutton = selectreadfilebutton+"<button id='"+files[i]+"'>"+files[i]+"</button>";
    };
    console.log(selectreadfilebutton);
    document.getElementById("inuploadbutton").innerHTML = "";
    document.getElementById("other").innerHTML = selectreadfilebutton;
    function setbuttonclickevents(filename){
      document.getElementById(filename).addEventListener("click",
      async (e)=>{
        document.getElementById("other").innerHTML = "<button id='opfile'>ファイルを開く</button>";
        document.getElementById("opfile").addEventListener("click",
        async (e)=>{
          openfile();
        });
        editingfile(filename);
        console.log(filename);
      });
    };
    for (var i =0;i < files.length;i++){
      setbuttonclickevents(files[i]);
      console.log(files[i]);
    };
  };

  async function editingfile(flname){
    console.log(flname);
    var file = await dirHandle.getFileHandle(flname);
    var fileData = await file.getFile();
    var text = await fileData.text();
    document.getElementById("workspace").innerHTML = document.getElementById("workspace").innerHTML + '<li id=' + flname + '"-edit">' + flname + '<br><textarea id="' + flname + "-editing" + '" name="content" rows="5" cols="33">' + text + '</textarea> <button id="' + flname + '-save">保存</button></li>';

    var saveButton = document.getElementById(flname + "-save");
    console.log(flname + "-save");
    console.log("次進んだぞ");
    console.log(flname);
    document.getElementById(flname + "-save").addEventListener("click",
      async (e)=>{
      var sampleConfig = document.getElementById(flname + "-editing").value;
      
      console.log("clickイベント動いてます");

      var blob = new Blob([sampleConfig], {
        type: "text/plain"
      });
      var writableStream = await file.createWritable();
      await writableStream.write(blob);
      await writableStream.close();
      window.alert("保存しました。 ");
      console.log(flname);
    });
  };
});
