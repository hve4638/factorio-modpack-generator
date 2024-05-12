import {useEffect, useState} from 'react'
import './style/Flex.css';
import './style/Widget.css';
import './style/Factorio.css';
import GitHubMark from './Img/github-mark.png';
import {mods} from './Data.js';
import {download} from './Utils/FileDownload.js';
import {downloadModPack} from './GenerateModPack.js';

const SITE_TITLE = '편의성 모드 묶는건데 이름미정';
const BASE_PATH = '/assets/deploy/factorio-modpack-generator';
const THUMBNAIL_PATH = 'thumbnails';

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

  return (
    <div className='column fill undraggable'>
      <header style={{ padding: '15px', height: '30px'}}>
        <h2>{SITE_TITLE}</h2>
      </header>
      <div className='row' style={{ height : 'auto', overflowY:'auto' }}>
        <div className='column' style={{ width: '50%', height : 'auto' }}>
          <p className='title' style={{ margin : '8px'}}>모드 목록</p>
          <div
            className='content scrollbar'
            style={{ 
              padding: '0px', marginRight : '0px', overflowY: 'auto',
            }}
          >
            <div className='column wfill'>
            {
              mods.map((item, index) => (   
                <ModInfo
                  key={index}
                  data={item}
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
                />
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
          <p className='title' style={{ margin : '8px'}}>미리보기</p>
          <InfoPreview info={currentInfo}></InfoPreview>
          <MetaData metadata={metadata} onChange={(changed)=>setMetadata(changed)}></MetaData>
        </div>
      </div>

      <div className='row footer' style={{ height : '64px' }}>
        <div className='center' style={{marginLeft:'10px'}}>
          <img alt='link' src={GitHubMark} height='30px'/>
        </div>
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
          <span className='center' style={{paddingRight: "4px"}}>Export</span>
          <span className="material-symbols-outlined" style={{fontSize:'18px'}}>description</span>
        </button>
        <button 
          className='row center'
          onClick={()=>downloadModPack(currentInfo)}
        >
          <span className='center' style={{paddingRight: "4px"}}>Export</span>
          <span class="material-symbols-outlined" style={{fontSize:'18px'}}>folder_zip</span>
        </button>
      </div>
    </div>
  );
}

function InfoPreview({info}) {
  return (
    <div className='column noflex textplace draggable' style={{ height : '200px', overflow: 'auto'}}>
      <div>{JSON.stringify(info, null, 2)}</div>
    </div>
  );
}

function ModInfo({data, checked, onClick, onCheck}) {
  return (
    <div className='section-darker row'
      onClick={(e)=>onClick()}
      style={{ height : '24px'}}>
      <div className='flex'>{data.name}</div>
      <div className='center'>
        <Checkbox checked={checked} onClick={(e)=>onCheck(!checked)}/>
      </div>
    </div>
  );
}

function ModDetail({data}) {
  const {name, author, thumbnail, descriptions} = data;
  
  if (name === undefined) {
    return (<></>)
  }
  else {
    return (
      <div className='column' style={{ margin : '8px' }}>
        <div className='row'>
          <div className='column flex'>
            <p className='title'>{name}</p>
            <p>by <span className='orange'>{author}</span></p>
          </div>
          <div className='noflex'>
            <img
              alt='thumbnail'
              src={`${BASE_PATH}/${THUMBNAIL_PATH}/${thumbnail}`}
              height={48}
            />
          </div>
        </div>
        <hr></hr>
        {
          descriptions.map((line)=>(<p>{line}</p>))
        }
      </div>
    );
  }
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

function MetaData({metadata, onChange}) {
  const changeMetadata = (key, value) => {
    const updated = {...metadata};
    updated[key] = value;
    console.log(value)
    onChange(updated);
  }
  return (
    <div className='column noflex draggable' style={{ margin: '8px' }}>
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
          title='저자'
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

export default App;
