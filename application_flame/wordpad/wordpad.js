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
  var openetedfile = "";
  function sleep(waitMsec) {
    var startMsec = new Date();
    while (new Date() - startMsec < waitMsec);
  }

  var nicname = await idbKeyval.get("nicname");
  if (!nicname) {
    var nicnameresult = "";
    while (nicnameresult == "" || nicnameresult == null){
      nicnameresult = window.prompt("名前を入力してください")
    }
    idbKeyval.set("nicname",nicnameresult)
    nicname = nicnameresult;
  }

  var ontabclickedprocess = [];
  var iv = -1;
  var tabs = [];
  var showededitingimgdialog = false;

  var files = [];
  for await (var handle of dirHandle.values()) {
    if (handle.kind === 'file') {
      files.push(handle.name);
    } else if (handle.kind === 'directory') {
      files.push(handle.name + '/');
    }
  };
  console.log(files);
  async function showopenfilebutton (){
    document.getElementById("sectionbar").innerHTML = "";

    
    var createfilebutton = document.createElement("button");
    createfilebutton.innerHTML = "新しくファイルを作成..."
    document.getElementById('sectionbar').appendChild(createfilebutton)
    createfilebutton.addEventListener("click",
    async (e)=>{
      var newfilename = await window.prompt("新しく作成するファイルの名前を入力してください。")
      var newfilehandle = await dirHandle.getFileHandle(newfilename + '.xml', { create: true });
      var sampleConfig = '<navigator><title>' + newfilename + '</title><creator>' + nicname + '</creator><lastsaved>2023-03-07</lastsaved><shared>false</shared><content><textarea rows="25" cols="117" class="textareas">ここに文字を入力...</textarea></content></navigator>';
      
      console.log("clickイベント動いてます")

      var blob = new Blob([sampleConfig], {
        type: "text/plain"
      })

      var writableStream = await newfilehandle.createWritable()
      await writableStream.write(blob)
      await writableStream.close()
      console.log(flname)
      idbKeyval.set('dir', dirHandle)
      sleep(800);
      showopenfilebutton();
      
      
    })
    document.getElementById("sectionbar").appendChild(document.createElement("br"));
    document.getElementById("sectionbar").appendChild(document.createElement("br"));

    for (var i =0;i < files.length;i++){
      console.log("forが始まったぞ");
      var file = await dirHandle.getFileHandle(files[i]);
      var fileData = await file.getFile();
      var filecontent = await fileData.text();
      var dpObj = new DOMParser();
      var xmlText = '<?xml version="1.0" encoding="UTF-8"?>';
      xmlText += filecontent;
      var xmlDoc = dpObj.parseFromString(xmlText, "text/xml");
      var xmlcreator = xmlDoc.getElementsByTagName("creator")[0].innerHTML;
      var xmlshared = xmlDoc.getElementsByTagName("shared")[0].innerHTML;
      if (xmlcreator === await idbKeyval.get("nicname") || xmlshared == "true"){
      var newflexmenu = document.createElement("div");
      document.getElementById("sectionbar").appendChild(newflexmenu);
      newflexmenu.setAttribute("height","220");
      newflexmenu.setAttribute("style","border-radius: 10px; border: 3px solid; border-color: #038cfc; background-color:#ffffff;")
      var but = document.createElement("button");
      newflexmenu.appendChild(but);
      but.textContent = files[i];
      but.setAttribute("id",files[i] + "-select")
      but.setAttribute("class","openfiles")
      but.addEventListener("click",
        async (e)=>{
          //console.log(e.path);
          document.getElementById("other").innerHTML = "<button id='opfile'>ファイルを開く</button>";
          document.getElementById("opfile").addEventListener("click",
          async (e)=>{
            openfile();
          });
          console.log(i)
          editingfile(e.srcElement.innerHTML);
          console.log(files[i]);
      });
      var detail = document.createElement("p")
      newflexmenu.appendChild(detail)
      var file = await dirHandle.getFileHandle(files[i]);
      var fileData = await file.getFile();
      var filecontent = await fileData.text();
      var dpObj = new DOMParser();
      var xmlText = '<?xml version="1.0" encoding="UTF-8"?>';
      xmlText += filecontent;
      var xmlDoc = dpObj.parseFromString(xmlText, "text/xml");
      detail.innerHTML = "作成者<br>" + xmlDoc.getElementsByTagName("creator")[0].innerHTML;
      document.getElementById("sectionbar").appendChild(document.createElement("br"));
    }
    }
    
  }
  showopenfilebutton();
  document.getElementById("finder").addEventListener("click",
  async (e)=>{
    showopenfilebutton();
  });
  document.getElementById("editmenu").addEventListener("click",
  (e)=>{
    var secbar = document.getElementById("sectionbar");
    secbar.innerHTML = "";
    var createtextareabutton = document.createElement("button");
    createtextareabutton.innerHTML = "テキストエリアを追加";
    secbar.appendChild(createtextareabutton);
    var uploadimagebutton = document.createElement("button");
    uploadimagebutton.innerHTML = "画像をアップロード";
    secbar.appendChild(uploadimagebutton);
    var uploadaudiobutton = document.createElement("button");
    uploadaudiobutton.innerHTML = "音声をアップロード";
    secbar.appendChild(uploadaudiobutton);
    var uploadvideobutton = document.createElement("button");
    uploadvideobutton.innerHTML = "動画をアップロード";
    secbar.appendChild(uploadvideobutton);
    createtextareabutton.addEventListener("click",
    async (e)=>{
      //<textarea rows="25" cols="117" class="textareas">ここに文字を入力...</textarea>
      var newtextarea = document.createElement("textarea");
      newtextarea.setAttribute("rows","25");
      newtextarea.setAttribute("cols","117");
      newtextarea.setAttribute("class","textareas");
      newtextarea.innerHTML = "ここに文字を入力...";
      document.getElementById("workspace").appendChild(newtextarea);
    })
    uploadimagebutton.addEventListener("click",
    async (e)=>{
      var pickeroption = {
        types: [
            {
              description: 'Images',
              accept: {
                'image/*': ['.png', '.gif', '.jpeg', '.jpg','.webp','.svg']
              }
            },
          ]
        }
      var fh_list = await window.showOpenFilePicker(pickeroption);
      var fh = fh_list[0];
      var imagefile = await fh.getFile(); 
      var reader = new FileReader()
      reader.addEventListener('load', e => {
        var dataurlfromimage = reader.result;
        document.getElementById("workspace").appendChild(document.createElement("br"));
        var newimage = document.createElement("img");
        newimage.setAttribute("src",dataurlfromimage);
        newimage.setAttribute("class","images");
        document.getElementById("workspace").appendChild(newimage)
      })
      
      if (imagefile) {
        reader.readAsDataURL(imagefile);
      }
    })
    uploadaudiobutton.addEventListener("click",
    async (e)=>{
      var pickeroption = {
        types: [
          {
            description: "audios",
            accept: {
              "audio/*": [".wav", ".mp3", "midi", "mid"]
            }
          },
        ]
      }
      var fh_list = await window.showOpenFilePicker();
      var fh = fh_list[0];
      var audiofile = await fh.getFile();
      var reader = new FileReader();
      reader.addEventListener("load", e => {
        var dataurlfromaudio = reader.result;
        document.getElementById("workspace").appendChild(document.createElement("br"));
        var newaudio = document.createElement("audio");
        newaudio.setAttribute("controls","");
        newaudio.setAttribute("src",dataurlfromaudio);
        document.getElementById("workspace").appendChild(newaudio)
      })

      if (audiofile) {
        reader.readAsDataURL(audiofile);
      }
    })
    uploadvideobutton.addEventListener("click",
    async (e)=>{
      var pickeroption = {
        types: [
            {
              description: 'videos',
              accept: {
                'video/*': ['.mpeg', '.mp4', '.webm']
              }
            },
          ]
        }
      var fh_list = await window.showOpenFilePicker(pickeroption);
      var fh = fh_list[0];
      var videofile = await fh.getFile();
      var reader = new FileReader();
      reader.addEventListener('load', e => {
        var dataurlfromvideo = reader.result;
        document.getElementById("workspace").appendChild(document.createElement("br"));
        var newvideo = document.createElement('video');
        newvideo.setAttribute('src', dataurlfromvideo);
        newvideo.setAttribute('type',videofile.type)
        newvideo.setAttribute("controls","");
        document.getElementById('workspace').appendChild(newvideo)
      })
      
      if (videofile) {
        reader.readAsDataURL(videofile);
      }
    })
  });
  document.getElementById("gitmenu").addEventListener("click",
  async (e)=>{
    var secbar = document.getElementById("sectionbar");
    secbar.innerHTML = "";
    var sharebutton = document.createElement("button");
    secbar.appendChild(sharebutton);
    sharebutton.innerHTML = "この文書を共有..."
    sharebutton.addEventListener("click",
    async (e)=>{
      //openetedfileを忘れるな
      window.alert("共有します。")
      var file = await dirHandle.getFileHandle(openetedfile)
          var fileData = await file.getFile()
          var text = await fileData.text()
          var dpObj = new DOMParser()
          var xmlText = '<?xml version="1.0" encoding="UTF-8"?>'
          xmlText += text
          var xmlDoc = dpObj.parseFromString(xmlText, "text/xml")
          var tit = xmlDoc.getElementsByTagName("title")[0].innerHTML;
          var sampleConfig = "<navigator><title>" + tit + "</title><creator>" + nicname + "</creator><lastsaved>2023-03-07</lastsaved><shared>true</shared><content>" + document.getElementById("workspace").innerHTML + "</content></navigator>";
      
          console.log("clickイベント動いてます")

          var blob = new Blob([sampleConfig], {
            type: "text/plain"
          })

          var writableStream = await file.createWritable()
          await writableStream.write(blob)
          await writableStream.close()
          window.alert("共有しました。 ")
          console.log(openetedfile)
          idbKeyval.set('dir', dirHandle)
      
    });
  })

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
    openetedfile = flname;
    console.log(flname);
    var file = await dirHandle.getFileHandle(flname);
    var fileData = await file.getFile();
    var filecontent = await fileData.text();
    var dpObj = new DOMParser();
    var xmlText = '<?xml version="1.0" encoding="UTF-8"?>';
    xmlText += filecontent;
    var xmlDoc = dpObj.parseFromString(xmlText, "text/xml");
    var title = xmlDoc.getElementsByTagName('title')[0].textContent;
    var content = xmlDoc.getElementsByTagName("content")[0].innerHTML;

    document.title = flname + " - JS WordPad";

    document.getElementById("workspace").innerHTML = "";
    document.getElementById("workspace").innerHTML = content;
    var textareas = document.getElementsByClassName("textareas");
    for (var i = 0;i<textareas.length;i++){
      textareas[i].addEventListener("input",
      async (e)=>{
        e.target.innerHTML = e.target.value;
      })
    }
    var imgs = document.getElementsByClassName("images");
    for (var i = 0;i<imgs.length;i++){
      imgs[i].addEventListener("click",
      async (e)=>{
        if (!showededitingimgdialog) {
          showededitingimgdialog = true;
          var editingimg = e.target;
          var neweditingimgdialog = document.createElement("div");
          neweditingimgdialog.setAttribute("class","editingimgdialog");
          document.getElementById("workspace").insertBefore(neweditingimgdialog,e.target);
          var deleteimgbutton = document.createElement("button");
          deleteimgbutton.innerHTML = "画像を削除"
          neweditingimgdialog.appendChild(deleteimgbutton);
          deleteimgbutton.addEventListener("click",
          async (e)=>{
            editingimg.remove();
            neweditingimgdialog.remove();
          })
        }
      })
    }

    var saveButton = document.createElement("button");
    document.getElementById("insavebutton").innerHTML = "";
    document.getElementById("insavebutton").appendChild(saveButton);
    saveButton.id = flname + "-save";
    saveButton.textContent = "保存";
    console.log(flname + "-save");
    console.log("次進んだぞ");
    console.log(flname);
    ontabclickedprocess.push(
      async (e)=>{
        openetedfile = flname;
        console.log(flname)
        var file = await dirHandle.getFileHandle(flname)
        var fileData = await file.getFile()
        var text = await fileData.text()
        var dpObj = new DOMParser()
        var xmlText = '<?xml version="1.0" encoding="UTF-8"?>'
        xmlText += text
        var xmlDoc = dpObj.parseFromString(xmlText, "text/xml")
        var title = xmlDoc.getElementsByTagName('title')[0].textContent
        var content = xmlDoc.getElementsByTagName("content")[0].innerHTML


        document.title = flname + " - JS WordPad"

        document.getElementById("workspace").innerHTML = content
        var textareas = document.getElementsByClassName("textareas");
          for (var i = 0;i<textareas.length;i++){
          textareas[i].addEventListener("input",
          async (e)=>{
            e.target.innerHTML = e.target.value;
          })
        }
        var imgs = document.getElementsByClassName("images");
        for (var i = 0;i<imgs.length;i++){
          imgs[i].addEventListener("click",
          async (e)=>{
            if (!showededitingimgdialog) {
              showededitingimgdialog = true;
              var editingimg = e.target;
              var neweditingimgdialog = document.createElement("div");
              neweditingimgdialog.setAttribute("class","editingimgdialog");
              document.getElementById("workspace").insertBefore(neweditingimgdialog,e.target);
              var deleteimgbutton = document.createElement("button");
              deleteimgbutton.innerHTML = "画像を削除"
              neweditingimgdialog.appendChild(deleteimgbutton);
              deleteimgbutton.addEventListener("click",
              async (e)=>{
                editingimg.remove();
                neweditingimgdialog.remove();
              })
              var replimgbutton = document.createElement("button");
              replimgbutton.innerHTML = "画像を置き換え";
              document.getElementsByClassName("editingimgdialog")[0].appendChild(replimgbutton);
              replimgbutton.addEventListener("click",
              async (e)=>{
                var pickeroption = {
                  types: [
                      {
                        description: 'Images',
                        accept: {
                          'image/*': ['.png', '.gif', '.jpeg', '.jpg','.webp','.svg']
                        }
                      },
                    ]
                  }
                var fh_list = await window.showOpenFilePicker(pickeroption);
                var fh = fh_list[0];
                var imagefile = await fh.getFile(); 
                var reader = new FileReader()
                reader.addEventListener('load', e => {
                  editingimg.src = reader.result;
                  document.getElementsByClassName("editingimgdialog")[0].remove();
                })
                
                if (imagefile) {
                  reader.readAsDataURL(imagefile);
                }
              })
            }
          })
        }
        var saveButton = document.createElement("button")
        document.getElementById("insavebutton").innerHTML = "";
        document.getElementById("insavebutton").appendChild(saveButton)
        saveButton.id = flname + "-save"
        saveButton.textContent = "保存"
        console.log(flname + "-save")
        console.log("次進んだぞ")
        console.log(flname)

        saveButton.addEventListener("click",
        async (e)=>{
          var file = await dirHandle.getFileHandle(flname)
          var fileData = await file.getFile()
          var text = await fileData.text()
          var dpObj = new DOMParser()
          var xmlText = '<?xml version="1.0" encoding="UTF-8"?>'
          xmlText += filecontent
          var xmlDoc = dpObj.parseFromString(xmlText, "text/xml")
          var xmltitle = xmlDoc.getElementsByTagName("title")[0].innerHTML;
          var xmlshared = xmlDoc.getElementsByTagName("shared")[0].innerHTML;
          var sampleConfig = "<navigator><title>" + xmltitle + "</title><creator>" + nicname + "</creator><lastsaved>2023-03-07</lastsaved><shared>" + xmlshared + "<content>" + document.getElementById("workspace").innerHTML + "</content></navigator>";
      
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
      e.srcElement.setAttribute("class","tabselected");
      ontabclickedprocess[parseInt(e.srcElement.id)]();
    });
    
    saveButton.addEventListener("click",
      async (e)=>{
      var file = await dirHandle.getFileHandle(flname)
      var fileData = await file.getFile()
      var text = await fileData.text()
      var dpObj = new DOMParser()
      var xmlText = '<?xml version="1.0" encoding="UTF-8"?>'
      xmlText += text
      var xmlDoc = dpObj.parseFromString(xmlText, "text/xml")
      var xmltitle = xmlDoc.getElementsByTagName("title")[0].innerHTML;
      var xmlshared = xmlDoc.getElementsByTagName("shared")[0].innerHTML;
      var sampleConfig = "<navigator><title>" + xmltitle + "</title><creator>" + nicname + "</creator><lastsaved>2023-03-07</lastsaved><shared>" + xmlshared + "</shared><content>" + document.getElementById("workspace").innerHTML + "</content></navigator>"
      
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