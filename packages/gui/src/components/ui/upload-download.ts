import m, { FactoryComponent } from 'mithril';
import { Settings } from '../../models';
import { FlatButton } from 'mithril-materialized';
import { formatDate } from '../../utils';

interface FileInputEvent {
  target: HTMLInputElement & EventTarget;
  files: File[];
}

export const UploadDownload: FactoryComponent<{
  settings: Settings;
  saveSettings: (s: Settings) => Promise<void>;
}> = () => {
  let saveSettings: (s: Settings) => Promise<void>;

  function downloadSettings(settings: Settings) {
    // Send request to server to download settings
    // Save settings as a JSON file on user's PC
    const filename = `${formatDate(Date.now())}_settings_v${settings.version}.json`;
    const blob = new Blob([JSON.stringify(settings)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function handleFileUpload(event: FileInputEvent) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsedSettings = JSON.parse(reader.result as string) as Settings;
        if (parsedSettings.vehicles && parsedSettings.vehicles instanceof Array) {
          parsedSettings.vehicles = parsedSettings.vehicles.map((v) => ({ ...v, visible: 'visible' }));
        }
        saveSettings(parsedSettings);
      } catch (error) {
        console.error('Error parsing JSON file:', error);
      }
    };
    reader.readAsText(file);
  }

  function uploadSettings() {
    // Trigger the file input click event
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  function onFileInputChange(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    if (!fileInput.files) return;
    const file = fileInput.files[0];
    handleFileUpload({ target: fileInput, files: [file] });
    // Reset file input value to allow uploading the same file again
    fileInput.value = '';
  }
  return {
    view: ({ attrs: { settings, saveSettings: save } }) => {
      saveSettings = save;

      return m('.right', [
        m(FlatButton, { iconName: 'download', onclick: () => downloadSettings(settings) }),
        m('input[type=file][accept=.json]', {
          id: 'file-input',
          style: { display: 'none' },
          onchange: onFileInputChange,
        }),
        m(FlatButton, { iconName: 'upload', onclick: uploadSettings }),
      ]);
    },
  };
};
