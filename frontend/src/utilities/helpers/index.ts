export function isValidJson(str: any):boolean {
  try {
    var obj = JSON.parse(str);
    if (obj && typeof obj === 'object') {
      return true;
    }
  } catch (e) {
    console.error('Not a Valid JSON');
    return false;
  }
  return true;
}

export function ObjectToQueryString(obj: { [key: string]: any }, encodeURI: boolean = true):string {
    let keys = Object.keys(obj);
    if (keys.length == 0) {
        return "";
    }
  let queryString = !!encodeURI
    ? keys
        .reduce(function (a, k) {
          a.push(k + '=' + encodeURIComponent(obj[k]));
          return a;
        }, [])
        .join('&')
    : keys
        .reduce(function (a, k) {
          a.push(k + '=' + obj[k]);
          return a;
        }, [])
        .join('&');
  return `?${queryString}`;
}


 export const getCookie = (cname:string) => {
    const name = cname + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return '';
  };