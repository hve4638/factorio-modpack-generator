import {useEffect, useState} from 'react'
import './style/Flex.css';
import './style/Widget.css';
import './style/Factorio.css';
import UnfoldIcon from './Icons/unfold.svg';
import FoldIcon from './Icons/fold.svg';
import GitHubMark from './Icons/github-mark.png';
import SearchIcon from './Icons/search.svg';
import UploadIcon from './Icons/upload.svg';
//import {tagInfo} from './Data/Tags.js';
//import {mods} from './Data/Mods.js';
import {download} from './Utils/FileDownload.js';
import {downloadModPack} from './GenerateModPack.js';
import {stringHasNaively, setHasAny} from './Utils.js';
import JSZip from 'jszip';

const GITHUB_LINK='https://github.com/hve4638/factorio-modpack-generator'

const SITE_TITLE = 'Factorio ModPack Generator';
const BASE_PATH = '/deploy/factorio-modpack-generator';
const THUMBNAIL_PATH = 'thumbnails';
const NOTAG = '태그 없음'

let enablePopover = (text) => {}
let disablePopover = () => {}
let setPopoverPosition = (x,y) => {}

let mods = [];
let tagInfo = [];

async function loadData() {
  {
    const response = await fetch(`${BASE_PATH}/data/mods.json`);
    mods = await response.json();
  }
  {
    const response = await fetch(`${BASE_PATH}/data/tags.json`);
    tagInfo = await response.json();
  }
}

function App() {
  const [metadata, setMetadata] = useState({
    factorio_version : '1.1',
    name : '',
    title : '',
    version : '1.0.0',
    author : '',
    description : '',
  });
  const [currentModDetail, setCurrentModDetail] = useState({});
  const [checkedMod, setCheckedMod] = useState(new Set());
  const currentInfo = {
    name : metadata.name,
    title : metadata.title,
    factorio_version: metadata.factorio_version,
    version : metadata.version,
    author : metadata.author,
    description : metadata.description,
    contact : '',
    hompage : '',
    dependencies : [...checkedMod]
  }
  const [isUnfoldPreview, setIsUnfoldPreview] = useState(true);
  const [selectedTags, setSelectedTags] = useState(new Set());
  const [tags, setTags] = useState(new Set());
  const [search, setSearch] = useState('');
  const [modlist, setModlist] = useState([]);
  const [popoverEnabled, setPopoverEnabled] = useState(false);
  const [popoverText, setPopoverText] = useState('');
  const [popoverX, setPopoverX] = useState(0);
  const [popoverY, setPopoverY] = useState(0);
  const [modalImportEnabled, setModalImportEnabled] = useState(false);

  useEffect(() => {
    const newmodlist = [];
    const searchFormatted = search.toLowerCase().replace(/[ .-]/g, '');
    const searchNoTagged = selectedTags.has(NOTAG);
    for (const mod of mods) {
      if (!stringHasNaively(mod.name, searchFormatted)) {
        continue;
      }
      
      if (mod.tags.length == 0 && searchNoTagged) {
        // pass
      }
      else if (selectedTags.size != 0 && !setHasAny(mod.tags, selectedTags)) {
        continue;
      }

      newmodlist.push(mod)
    }
    setModlist(newmodlist);
  }, [search, selectedTags])

  useEffect(()=>{
    const load = async () => {
      await loadData();
      enablePopover = (text) => {
        if (text !== undefined) {
          setPopoverEnabled(true);
          setPopoverText(text);
        }
      }
      disablePopover = () => setPopoverEnabled(false);
      setPopoverPosition = (x, y) => {
        setPopoverX(x + 20);
        setPopoverY(y + 10);
      }
  
      const newtags = new Set();
      for (const mod of mods) {
        for (const tag of mod.tags) {
          newtags.add(tag);
        }
      }
      newtags.add(NOTAG)
      setTags(newtags);
      setModlist(mods);
    }

    load();
  }, []);
  

  return (
    <div className='column fill undraggable'>
      <header style={{ padding: '15px', height: '30px'}}>
        <h2>{SITE_TITLE}</h2>
      </header>
      <main className='row flex' style={{ height : 'auto', overflowY:'auto' }}>
        <div className='column' style={{ width: '50%', height : 'auto' }}>
          <div className='row'>
            <p className='title noflex' style={{ margin : '8px'}}>모드 목록</p>
            <div className='flex'></div>
            <div className='center' style={{margin:'4px 0px 4px 0px'}}>
              <input
                value={search}
                style={{width:'120px', margin: '0px 8px 0px 0px'}}
                onChange={(e)=>setSearch(e.target.value)}
              />
            </div>
            <div style={{ margin : '8px 8px 8px 0px', height: '38'}}>
              <img src={SearchIcon} alt='search'/>
            </div>
          </div>
          <div
            className='content scrollbar hfill'
            style={{ 
              padding: '0px', marginRight : '0px', overflowY: 'auto',
            }}
          >
            <div className='column wfill'>
            {
              modlist.map((item, index) => {
                return (<ModInfo
                  key={index}
                  data={item}
                  selected={currentModDetail==item}
                  checked={checkedMod.has(item.mod)}
                  onClick={()=>{
                    setCurrentModDetail(item);
                  }}
                  onCheck={(checked)=>{
                    const copied = new Set([...checkedMod]);
                    if (checked) copied.add(item.mod);
                    else copied.delete(item.mod);
                    setCheckedMod(copied);
                  }}
                />);
              })
            }
            </div>
          </div>
          
          <div className='column noflex' style={{height : '110px'}}>
            <p className='title noflex' style={{ margin : '8px 8px 0px 8px'}}>태그</p>
            <div id='tags' className='row scrollbar'>
              {
                [...tags].map((key, index)=>(
                  <div
                    key={index}
                    className={`modtag${
                      selectedTags.size == 0
                      ? ''
                      : (
                        selectedTags.has(key)
                        ? ' enabled'
                        : ' disabled'
                      )
                    }`
                    }
                    onClick={(e) => {
                      const selected = new Set(selectedTags);
                      if (selected.has(key)) {
                        selected.delete(key);
                      }
                      else {
                        selected.add(key);
                      }

                      setSelectedTags(selected);
                    }}
                    onMouseEnter={() => enablePopover(tagInfo[key]?.descriptions[0])}
                    onMouseLeave={() => disablePopover()}
                    onMouseMove={(e) => setPopoverPosition(e.clientX, e.clientY)}
                  >
                    {key}
                  </div>
                ))
              }
            </div>
          </div>
        </div>

        <div className='column' style={{ width: '50%', height: 'auto' }}>
          <div>
            <p className='title' style={{ margin : '8px'}}>모드 설명</p>
          </div>
          <div className='column flex mod-detail'>
            <ModDetail data={currentModDetail}></ModDetail>
          </div>
          <div className='row'>
            <p className='title flex' style={{ margin : '8px 8px 0px 8px'}}>미리보기</p>
            <div
              className='center clickable'
              style={{ margin : '8px'}}
              onClick={()=>setIsUnfoldPreview(!isUnfoldPreview)}
            >
              <img
                alt='fold'
                src={isUnfoldPreview ? FoldIcon : UnfoldIcon}
              />
            </div>
          </div>
          {
            isUnfoldPreview &&
            <InfoPreview info={currentInfo}></InfoPreview>
          }
          <div className='column noflex' style={{height : '110px'}}>
            <MetaData metadata={metadata} onChange={(changed)=>setMetadata(changed)}></MetaData>
          </div>
        </div>
      </main>

      <footer className='row footer' style={{ height : '48px' }}>
        <div className='flex'>
          <div
            id='link-github'
            className='center' style={{marginLeft:'10px'}}
            onClick={() => window.open(GITHUB_LINK)}
          >
            <img alt='link' src={GitHubMark} height='30px'/>
          </div>
          <div className='flex'></div>
          <button 
            className='row center blue'
            onClick={()=>setModalImportEnabled(true)}
          >
            <span className='center' style={{paddingRight: "4px"}}>Import</span>
            <span className="material-symbols-outlined" style={{fontSize:'18px'}}>upload</span>
          </button>
          
        </div>
        <div className='flex'>
          <div className='flex'></div>

          <button 
            className='row center'
            onClick={
              ()=>{
                const file = new Blob([JSON.stringify(currentInfo, null, 2)], {type:'text/plain'});
                download('info.json', file);
              }
            }
          >
            <span className='center' style={{paddingRight: "4px"}}>Export (json)</span>
            <span className="material-symbols-outlined" style={{fontSize:'18px'}}>description</span>
          </button>
          <button 
            className='row center'
            onClick={()=>downloadModPack(currentInfo)}
          >
            <span className='center' style={{paddingRight: "4px"}}>Export (zip)</span>
            <span className="material-symbols-outlined" style={{fontSize:'18px'}}>folder_zip</span>
          </button>
        </div>
      </footer>
      {
        popoverEnabled &&
        <div id='mod-description' className='tag-popover convex' style={{left: popoverX, top: popoverY }}>
          {popoverText}
        </div>
      }
      {
        modalImportEnabled &&
        <ImportModal
          onImport= {(data) => {
            setModalImportEnabled(false);
            
            setMetadata({
              factorio_version : data.factorio_version,
              name : data.name,
              title : data.title,
              version : data.version,
              author : data.author,
              description : data.description,
            });
            setCheckedMod(new Set(data.dependencies));
          }}
          onCancel = {() => setModalImportEnabled(false)}
        />
      }
    </div>
  );
}

function InfoPreview({info}) {
  return (
    <div className='column noflex textplace draggable scrollbar' style={{ height : '100px', overflowY: 'scroll'}}>
      <div>{JSON.stringify(info, null, 2)}</div>
    </div>
  );
}

function ModInfo({data, checked, onClick, onCheck, selected}) {
  return (
    <div className={`section-darker row ${selected ? 'selected' : ''}`}
      onClick={(e)=>onClick()}
      style={{ height : '24px'}}>
      <div className='flex'>{data.name} <span className='short-description'><i>{data.short_description}</i></span></div>
      <div className='center'>
        <Checkbox checked={checked} onClick={(e)=>onCheck(!checked)}/>
      </div>
    </div>
  );
}

function ModDetail({data}) {
  const {name, author, thumbnail, descriptions, site, tags} = data;
  let lastcolor = null;
  const parseText = (desc) => {
    const result = []
    let text = desc;
    while (true) {
        const index = text.indexOf("#");
        
        if (index == -1) {
            break;
        }
        else {
            const sliced = text.slice(0, index);

            if (sliced.length > 0) {
                result.push({ text: sliced, color: lastcolor });
            }
            
            const colorChar = text[index+1];
            if (colorChar == undefined) {
                break;
            }
            else if (colorChar == 'W') {
                lastcolor = null;
                text = text.slice(index+2);
            }
            else {
                lastcolor = colorChar;
                text = text.slice(index+2);
            }
        }
    }

    if (text.length > 0) {
        result.push({ text: text, color: lastcolor });
    }

    return result;
  }
  
  if (name === undefined) {
    return (<></>)
  }
  else {
    return (
      <div className='column flex' style={{ margin : '8px', overflow: 'auto' }}>
        <div className='row noflex'>
          <div className='column flex'>
            <p className='title'><a href={site} target="_blank">{name}</a></p>
            <p>by <span className='orange'>{author}</span></p>
          </div>
          <div className='noflex'>
            {
              thumbnail != '' &&
              <img
                alt='thumbnail'
                src={`${BASE_PATH}/${THUMBNAIL_PATH}/${thumbnail}`}
                height={48}
              />
            }
          </div>
        </div>
        <hr className='noflex'></hr>
        <div className='column flex scrollbar' style={{ overflowY: 'auto' }}>
        {
          descriptions.map(
            (line)=>(
              <p style={{padding:'4px 0px 4px 0px'}}>
                {
                  parseText(line).map((item)=>{
                    switch(item.color) {
                      default:
                      case null:
                        return item.text;
                        case 'R':
                          return (<span className='red'>{item.text}</span>)
                        case 'B':
                          return (<span className='blue'>{item.text}</span>)
                        case 'Y':
                          return (<span className='yellow'>{item.text}</span>)
                    }
                  })
                }
              </p>
            )
          )
        }
        </div>
        <div className='row noflex' style={{overflowX: 'hidden'}}>
          {
            tags.map((tag)=>{
              if (tagInfo[tag] == undefined) {
                return (
                  <div className='modtag unselectable'>
                    {tag}
                  </div>
                );
              }
              else {
                return (
                  <div
                    className='modtag unselectable'
                    onMouseEnter={() => enablePopover(tagInfo[tag].descriptions[0])}
                    onMouseLeave={() => disablePopover()}
                    onMouseMove={(e)=>{
                      setPopoverPosition(e.clientX, e.clientY);
                    }}
                  >
                    {tag}
                  </div>
                );
              }
            })
          }
        </div>
      </div>
    );
  }
}

function MetaData({metadata, onChange}) {
  const changeMetadata = (key, value) => {
    const updated = {...metadata};
    updated[key] = value;
    onChange(updated);
  }
  return (
    <div className='column noflex' style={{ margin: '8px' }}>
      <div className='row subaxis-center' style={{height : '32px'}}>
        <InputField
          title='모드팩 이름'
          onChange={(changed)=>changeMetadata('title', changed)}
          value={metadata.title}
        />
        <InputField
          title='내부 명칭'
          onChange={(changed)=>changeMetadata('name', changed)}
          value={metadata.name}
        />
      </div>
      <div className='row subaxis-center' style={{height : '32px'}}>
        <InputField
          title='제작자'
          onChange={(changed)=>changeMetadata('author', changed)}
          value={metadata.author}
        />
        <InputField
          title='모드팩 버전'
          onChange={(changed)=>changeMetadata('version', changed)}
          value={metadata.version}
        />
      </div>
      <div className='row subaxis-center' style={{height : '32px'}}>
        <InputField
          title='팩토리오 버전'
          onChange={(changed)=>changeMetadata('factorio_version', changed)}
          value={metadata.factorio_version}
        />
        <div className='flex'></div>
      </div>
    </div>
  );
}

function Checkbox({checked, onClick}) {
  return (
    <div className={`checkbox center${checked ? ' checked' : ''}`}
      onClick={(e)=>onClick(!checked)}
    >
      {
        checked &&
        <span className="material-symbols-outlined" style={{fontSize:'18px'}}>
          check
        </span>
      }
    </div>
  );
}

function InputField({title, value, onChange}) {
  return (
    <div className='flex'>
      <p className='title'>{title}</p>
      <div className='flex'></div>
      <input className='metadata' value={value}
        onChange={(e)=>onChange(e.target.value)}
      />
    </div>
  );
}

function ImportModal({ onImport, onCancel }) {
  const [data, setData] = useState(null);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [onFileHover, setOnFileHover] = useState(false);
  const onDragEnter = () => {
    setOnFileHover(true);
  };
  const onDragLeave = () => {
    setOnFileHover(false);
  };
  const handleDragOver = (event) => {
      event.preventDefault();
  };
  const parseFile = (file) => {
    const reader = new FileReader();

    if (file.name.slice(-5) == '.json') {
      reader.onload = (e) => {
        const content = e.target.result;
        try {
          const data = JSON.parse(content);
          setData(data);
          setMessage(`불러온 파일 : ${file.name}`);
        }
        catch(e) {
          setMessage('');
          setErrorMessage('잘못된 파일입니다');
        }
      }
      reader.readAsText(file);
    }
    else if (file.name.slice(-4) == '.zip') {
      reader.onload = function(e) {
        const arrayBuffer = e.target.result;
        
        JSZip.loadAsync(arrayBuffer).then(function(zip) {
          zip.forEach((path, entry) => {
            if (path.match(/.*[/]info.*[.]json/)) {
              entry.async("string").then(function(content) {
                try {
                  const data = JSON.parse(content);
                  setData(data);
                  setMessage(`불러온 파일 : ${file.name}`);
                } catch (e) {
                  setMessage('');
                  setErrorMessage('잘못된 파일입니다');
                }
            });
            }
          })
        }).catch(function(err) {
          setMessage('');
          setErrorMessage('잘못된 파일입니다');
        });
      };
    }
    else {
      setMessage('');
      setErrorMessage('잘못된 파일입니다');
    }

    reader.readAsArrayBuffer(file);
  };

  return (
  <div className='modal'>
    <div className='modpack-import convex column'>
      <p className='title noflex'>파일 가져오기</p>
      <div className='flex' style={{ margin:'4px 0px 4px 0px' }}>
        <label
          className={`filetransfer center clickable${onFileHover ? ' onfilehover' : ''}`}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDragOver={handleDragOver}
          onDrop={(event)=>{
            event.preventDefault();
            const file = event.dataTransfer.files[0];
            if (file) {
              parseFile(file);
            }
          }}
        >
          <input
            type='file'
            className='hide'
            onChange={(event)=>{
              const file = event.target.files[0];
              if (file) {
                parseFile(file);
              }
            }}
          />
          <img alt='' src={UploadIcon}/>
        </label>
      </div>
      <p className='red small'>{errorMessage}</p>
      <p className='green small'>{message}</p>
      <div className='row' style={{height : '35px'}}>
          <div className='flex'></div>
          <button
            className='row center red noflex'
            style={{margin:'3px', padding:'0px 5px 0px 5px'}}
            onClick = {(e)=>onCancel()}
          >취소</button>
          <button 
            className={`row center noflex${data == null ? ' disabled' : ''}`}
            style={{margin:'3px', padding:'0px 5px 0px 5px'}}
            onClick = {(e) => {
              if (data) {
                onImport(data);
              }
            }}
          >가져오기</button>
      </div>
    </div>
  </div>
  )
}

export default App;
