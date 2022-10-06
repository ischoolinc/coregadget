import { HttpClient } from '@angular/common/http';

export class DSAHttpClient {

    private static http: HttpClient

    public static setHttpClient(client: HttpClient) {
        this.http = client;
    }

    public static async post(url: string, xmlString?: string) {

        const rsp = await this.http.post(url, xmlString,
            {
                responseType: 'text',
                observe: 'response',
            }).toPromise();

        return rsp;

    }

    public static async get(url: string) {
        const rsp = await this.http.get(url,
            {
                responseType: 'text',
                observe: 'response',
            }).toPromise();

        return rsp;
    }
}

// const url = 'http://devg.ischool.com.tw:8080/dsa/dev.sh_d/admin/UDSManagerService.ExportContract?stt=basic&username=admin&password=1campus12%23%24&body=%3CRequest%3E%20%3CContractName%3E1campus.mobile.v2.student%3C/ContractName%3E%3C/Request%3E';

// HttpClient.get(url).then(rsp => {
//     console.log(rsp);
// });

// const body = `
// <Envelope>
// 	<Header>
// 		<TargetService>UDSManagerService.ExportContract</TargetService>
// 		<TargetContract>admin</TargetContract>
// 		<SecurityToken Type="Basic">
//             <UserName>admin</UserName>
//             <Password>1campus12#$</Password>
// 		</SecurityToken>
// 	</Header>
// 	<Body>
// 		<Request>
// 			<ContractName>1campus.mobile.v2.student</ContractName>
// 		</Request>
// 	</Body>
// </Envelope>
// `

// HttpClient.post("http://devg.ischool.com.tw:8080/dsa/dev.sh_d", body).then(rsp => {
//     console.log(rsp);
// }, err => {
//     console.log(err);
// })
