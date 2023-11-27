import React, { useCallback, useMemo, useRef, useState } from 'react';
import './App.css';
import { useEffect } from 'react';
import Swal from 'sweetalert2';

function App() {
  const isSaving = useRef<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    BannerUrl: '',
    WebUrl: '',
    FacebookUrl: '',
    YouTubeUrl: '',
    LineUrl: '',
  });
  const [imageError, setImageError] = useState(false);

  const _connection: any = useMemo(() => window.gadget.getContract("1campus.social_config.admin"), []);

  const GetConfigInfo = useCallback(() => {
    setIsLoading(true);
    _connection.send({
      service: "_.getConfig",
      body: {},
      result: function (response: any, error: any, http: any) {
        if (error !== null) {
          console.log('get config error: ', error);
          Swal.fire('載入失敗');
        } else {
          if (response?.Config) {
            setFormData(response.Config);
          }
          setIsReady(true);
        }
        setIsLoading(false);
      }
    });
  }, [_connection]);

  useEffect(() => {
    GetConfigInfo();
  }, [GetConfigInfo]);

  const onSave = async () => {
    if (isSaving.current) { return; }
    if (!(formData.BannerUrl.startsWith('https://'))) { Swal.fire('Banner網址必須使用安全的 HTTPS 通訊協定'); return; }
    if ((formData.BannerUrl.replace('https://', '')).length === 0) { Swal.fire('Banner網址無效'); return; }

    isSaving.current = true;
    _connection.send({
      service: "_.setConfig",
      body: { Content: formData },
      result: function (response: any, error: any, http: any) {
        if (error !== null) {
          console.log('set config error: ', error);
          Swal.fire('唉呀!','儲存失敗','error');
        } else {
          if (response?.Config) {
            setFormData(response.Config);
          }
          Swal.fire('太棒了!','儲存成功','success');
        }
        isSaving.current = false;
      }
    });
  }

  const handleImageLoad = () => {
    setImageError(false);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    )
  }

  if (!isReady) {
    return (
      <div className="flex flex-col items-center justify-center">
        初始化失敗，無法運行
      </div>
    )
  }

  return (
    <div className="px-8">
      {
        <form className="form">
          <div className="form-control w-full">
            <label className="label" htmlFor="inputBannerUrl"><span className="label-text">Banner網址 (請輸入以 https:// 開頭的網址，圖片寬高比為3:2，例：1200x800)</span></label>
            <input className="input input-bordered" id="inputBannerUrl" placeholder="請輸入Banner網址" type="text"
              value={formData.BannerUrl}
              onChange={(e) => setFormData({ ...formData, BannerUrl: e.target.value })}
              autoComplete="off" />
            {
              formData.BannerUrl && imageError && <span className='text-red-500 text-xs mt-2'>無效的 Banner 網址</span>
            }
            <div className="w-20 mb-4">
              <img
                src={formData.BannerUrl}
                alt={imageError ? '' : 'Banner'}
                onLoad={handleImageLoad}
                onError={handleImageError}
                style={{ display: imageError ? 'none' : 'block' }}
                width='100%'
                className='mt-4'
              />
            </div>

            <label className="label" htmlFor="inputWebUrl"><span className="label-text">學校網址</span></label>
            <input className="input input-bordered w-full mb-4" id="inputWebUrl" placeholder="請輸入學校網址" type="text"
              value={formData.WebUrl}
              onChange={(e) => setFormData({ ...formData, WebUrl: e.target.value })}
              autoComplete="off" />

            <label className="label" htmlFor="inputFacebookUrl"><span className="label-text">Facebook網址</span></label>
            <input className="input input-bordered w-full mb-4" id="inputFacebookUrl" placeholder="請輸入Facebook網址" type="text"
              value={formData.FacebookUrl}
              onChange={(e) => setFormData({ ...formData, FacebookUrl: e.target.value })}
              autoComplete="off" />

            <label className="label" htmlFor="inputYouTubeUrl"><span className="label-text">YouTube網址</span></label>
            <input className="input input-bordered w-full mb-4" id="inputYouTubeUrl" placeholder="請輸入YouTube網址" type="text"
              value={formData.YouTubeUrl}
              onChange={(e) => setFormData({ ...formData, YouTubeUrl: e.target.value })}
              autoComplete="off" />

            <label className="label" htmlFor="inputLineUrl"><span className="label-text">Line網址</span></label>
            <input className="input input-bordered w-full mb-4" id="inputLineUrl" placeholder="請輸入Line網址" type="text"
              value={formData.LineUrl}
              onChange={(e) => setFormData({ ...formData, LineUrl: e.target.value })}
              autoComplete="off" />
          </div>
          <div className="text-center">
            <button type="button" className="btn btn-primary mt-4" onClick={onSave}>儲存</button>
          </div>
        </form>
      }
    </div>
  );
}

export default App;
