import JSZip from 'jszip';
import {download} from './Utils/FileDownload';

export function downloadModPack(info) {
    const modpackName = `${info.name}_${info.version}`
    var zip = new JSZip();
    var folder = zip.folder(modpackName)

    folder.file("info.json", JSON.stringify(info, null, 2));
    
    zip.generateAsync({type:"blob"}).then((content) => {
        download(`${modpackName}.zip`, content);
    });
}
