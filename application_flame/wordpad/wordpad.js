var uploadButton = document.getElementById("upload");
uploadButton.addEventListener("click",
async (e)=>{
  var dirHandle = await idbKeyval.get('dir');
 
  if (dirHandle) {
    var permission = await dirHandle.queryPermission({ mode: 'readwrite' });
    if (permission !== 'granted') {
      permission = await dirHandle.requestPermission({ mode: 'readwrite' });
      if (permission !== 'granted') {
        window.alert('ERROR発生したじゃねえか!');
      }
    }
  } else {
    dirHandle = await window.showDirectoryPicker();
  };
  console.log(dirHandle);

  var ontabclickedprocess = [];
  var iv = -1;
  var tabs = [];

  var files = [];
  for await (var handle of dirHandle.values()) {
    if (handle.kind === 'file') {
      files.push(handle.name);
    } else if (handle.kind === 'directory') {
      files.push(handle.name + '/');
    }
  };
  console.log(files);
  for (var i =0;i < files.length;i++){
    console.log("forが始まったぞ");
    var but = document.createElement("button");
    document.getElementById("sectionbar").appendChild(but);
    but.textContent = files[i];
    but.setAttribute("id",files[i] + "-select")
    but.addEventListener("click",
      async (e)=>{
        //console.log(e.path);
        document.getElementById("other").innerHTML = "<button id='opfile'>ファイルを開く</button>";
        document.getElementById("opfile").addEventListener("click",
        async (e)=>{
          openfile();
        });
        console.log(i)
        editingfile(e.target.innerHTML);
        console.log(files[i]);
      });
  }

  document.getElementById("other").innerHTML = "開いてるファイルが無い<button id='opfile'>ファイルを開く</button>";
  document.getElementById("inuploadbutton").innerHTML = "";
  document.getElementById("opfile").addEventListener("click",
  async (e)=>{
    openfile();
  });

  async function openfile (){    
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
    var filecontent = await fileData.text();
    var text = JSON.parse(filecontent).content
    var title = JSON.parse(filecontent).title

    document.title = flname + " - JS WordPad";

    document.getElementById("workspace").innerHTML = "";
    var newworkspace = document.createElement("div");
    document.getElementById("workspace").appendChild(newworkspace);
    newworkspace.id = flname + "-edit";
    newworkspace.innerHTML = flname + '<br><textarea id="' + flname + "-editing" + '" name="content" rows="25" cols="117">' + text + '</textarea>';
    var saveButton = document.createElement("button");
    newworkspace.appendChild(saveButton);
    saveButton.id = flname + "-save";
    saveButton.textContent = "保存";
    console.log(flname + "-save");
    console.log("次進んだぞ");
    console.log(flname);
    ontabclickedprocess.push(
    async (e)=>{
        console.log(flname)
        console.log(e)
        var file = await dirHandle.getFileHandle(flname)
        var fileData = await file.getFile()
        var filecontent = await fileData.text()
        var text = JSON.parse(filecontent).content
        var title = JSON.parse(filecontent).title

        document.title = flname + " - JS WordPad"

        document.getElementById("workspace").innerHTML = ""
        var newworkspace = document.createElement("div")
        document.getElementById("workspace").appendChild(newworkspace)
        newworkspace.id = flname + "-edit"
        newworkspace.innerHTML = flname + '<br><textarea id="' + flname + "-editing" + '" name="content" rows="25" cols="117">' + text + '</textarea>'
        var saveButton = document.createElement("button")
        newworkspace.appendChild(saveButton)
        saveButton.id = flname + "-save"
        saveButton.textContent = "保存"
        console.log(flname + "-save")
        console.log("次進んだぞ")
        console.log(flname)

        saveButton.addEventListener("click",
        async (e)=>{
          var sampleConfig = '{"title":"' + title + '","content":"' + document.getElementById(flname + "-editing").value + '"}'
      
          console.log("clickイベント動いてます")

          var blob = new Blob([sampleConfig], {
            type: "text/plain"
          })

          var writableStream = await file.createWritable()
          await writableStream.write(blob)
          await writableStream.close()
          window.alert("保存しました。 ")
          console.log(flname)
          idbKeyval.set('dir', dirHandle)
        })
      }
    );
    var tabbutton = document.createElement("button");
    iv++;
    console.log(ontabclickedprocess)
    for (var i = 0;i < tabs.length;i++){
      tabs[i].setAttribute("class","tabnotselected");
    }
    tabbutton.setAttribute("class","tabselected");
    tabbutton.textContent = title;
    tabbutton.id = iv;
    document.getElementById("tabs").appendChild(tabbutton);
    tabs.push(tabbutton);
    tabbutton.addEventListener("click",
    (e)=>{
      for (var i = 0;i < tabs.length;i++){
        tabs[i].setAttribute("class","tabnotselected");
      };
      e.target.setAttribute("class","tabselected");
      ontabclickedprocess[parseInt(e.target.id)]();
    });
    
    saveButton.addEventListener("click",
    async (e)=>{
        var sampleConfig = '{"title":"' + title + '","content":"' + document.getElementById(flname + "-editing").value + '"}';
      
      console.log("clickイベント動いてます");

      var blob = new Blob([sampleConfig], {
        type: "text/plain"
      });

      var writableStream = await file.createWritable();
      await writableStream.write(blob);
      await writableStream.close();
      window.alert("保存しました。 ");
      console.log(flname);
      idbKeyval.set('dir', dirHandle);
    });
  };
});
