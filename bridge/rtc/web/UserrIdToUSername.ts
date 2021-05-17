// @ts-ignore


export class UserrIdToUSernameMappring {
    instance=null;
    map=new Map();
    constructor() {
        if(this.instance=null) {
             this.instance = new UserrIdToUSernameMappring();
        }
        return this.instance;
    }
    setUserMap(uid, uname) {
        this.map[uid] = uname;
    }

    getUserMap(uid) {
        return this.map[uid];
    }

}


