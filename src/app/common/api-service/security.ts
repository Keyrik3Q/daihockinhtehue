
import { Md5 } from 'ts-md5/dist/md5';

// https://www.npmjs.com/package/js-base64
import { Base64 } from 'js-base64';

export class Security {

    constructor() { }

    /**
     * 
     * @param input 
     */
    public encode(input: string): string | Int32Array {
        let md5 = new Md5();
        md5.appendStr(input);

        return md5.end();
    }

    /**
     * 
     * @param input 
     */
    public encode1(input: string): string | Int32Array {
        return Base64.encode(input);  // ZGFua29nYWk=;
    }

}