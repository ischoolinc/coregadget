import { SecurityToken, Envelope, SessionSecurityToken } from './envelope';
import { AccessPoint } from './access_point';
import { DSAHttpClient } from './dsa_http_client';
import { Jsonx } from './jsonx';

export const ConnectService = 'DS.Base.Connect';

export class Connection {

    private session: SecurityToken;

    private version: string;

    private create_at: Date;

    constructor(
        public readonly accessPoint: AccessPoint,
        private readonly securityToken: SecurityToken
    ) {
        this.create_at = new Date();
    }

    public get createAt() { return this.create_at; }

    public async connect(): Promise<Connection> {
        if(this.securityToken instanceof SessionSecurityToken) {
            this.session = this.securityToken;
            return this;
        }

        if(!this.useSession) return this;

        const { applicationUrl, contract } = this.accessPoint;

        const envelope = new Envelope();
        envelope.targetContract = contract;
        envelope.targetService = ConnectService;
        envelope.credential = this.securityToken;
        envelope.setBody('<RequestSessionID />');

        const rsp = await DSAHttpClient.post(applicationUrl, envelope.toString());

        const rspenv = new Envelope(rsp.body)

        if(rspenv.code !== '0') {
            throw new Error(rspenv.message);
        }

        const rspbody = rspenv.getBody();
        const sessionId = rspbody.child('SessionID').text

        if(!sessionId) {
            throw new Error('Session Not Supported.');
        }

        this.session = new SessionSecurityToken({ SessionID: sessionId });
        this.version = rspenv.header('Version').text;

        return this;
    }

    public getSession() {
        return this.session;
    }

    /** 取得 DSA 的核心版本。 */
    public getVersion() {
        return this.version;
    }

    /** 是否使用 session 機制。 */
    public useSession: boolean = true;

    /**
     * 
     * @param service 服務名稱。
     * @param body Xml 字串、Json 物件或是 Jsonx 物件。
     * @returns 
     */
    public async send(service: string, body?: string | Jsonx | any) {
        const { applicationUrl, contract } = this.accessPoint;

        if(!!!this.session) {
            throw new Error('請先連線後再呼叫 Service。');
        }

        const envelope = new Envelope();
        envelope.targetContract = contract;
        envelope.targetService = service;
        envelope.credential = this.session;
        envelope.setBody(body);

        const rsp = await DSAHttpClient.post(applicationUrl, envelope.toString());

        const rspenv = new Envelope(rsp.body)

        if(rspenv.code !== '0') {
            throw new Error(rspenv.message);
        }

        return rspenv.getBody();
    }
}

// async function main() {

//     const conn = new Connection(
//         await AccessPoint.resolve('dev.sh_d', 'admin'),
//         new BasicSecurityToken({UserName: 'admin', Password: '1campus12#$'})
//     );

//     await conn.connect();

//     // const body = '<Request><ContractName>1campus.mobile.v2.student</ContractName></Request>';

//     // const body = new Jsonx({ Request: { ContractName: { _text: '1campus.mobile.v2.student' } } });
    
//     const body = new Jsonx();
//     body.child('Request', 'ContractName').text = '1campus.mobile.v2.student';

//     const rsp = await conn.send('UDSManagerService.ExportContract', body);

//     const pkgs = rsp.child('Contract').children('Package', true);

//     for(const pkg of pkgs) {
//         console.log(pkg.getAttr('Name'));
//         for(const srv of pkg.children('Service', true)) {
//             const srvType = srv.child('Definition').getAttr('Type');
//             console.log(`\t${srv.getAttr('Name')}, ${srvType}`);
//         }
//     }

//     // console.log(rsp.toXml('Body'));
// }

// main();
