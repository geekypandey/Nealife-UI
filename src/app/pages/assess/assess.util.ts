import { HttpParams } from '@angular/common/http';

export const ITEMS_PER_PAGE = 5000;

export const createRequestOption = (req?: any): HttpParams => {
  let options: HttpParams = new HttpParams();
  if (req) {
    Object.keys(req).forEach(key => {
      if (key !== 'sort') {
        options = options.set(key, req[key]);
      }
    });
    if (req.sort) {
      options = options.append('sort', 'id,desc');
    }
    if (!req.page) {
      options = options.append('page', '' + 0);
    }
    if (!req.size) {
      options = options.append('size', '' + ITEMS_PER_PAGE);
    }
    options.set('delete.equals', 'false');
  } else {
    options = options.append('page', '0');
    options = options.append('size', ITEMS_PER_PAGE);
    options = options.append('sort', 'id,desc');
  }
  return options;
};

export const saveFile = (response: Blob, fileName: string, mimeType?: string) => {
  const blobUrl = URL.createObjectURL(response);
  const anchorEle = document.createElement('a');
  anchorEle.href = blobUrl;
  anchorEle.download = fileName;
  anchorEle.style.display = 'none';
  document.body.appendChild(anchorEle);
  anchorEle.click();
  URL.revokeObjectURL(blobUrl);
  anchorEle.remove();
};
