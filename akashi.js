// AKASHI_APIについてはこちらのリンクを参照
// https://akashi.zendesk.com/hc/ja/articles/115000475854-AKASHI-%E5%85%AC%E9%96%8BAPI-%E4%BB%95%E6%A7%98#get_records

//　TODO:class化する

const AKASHI_API_URL = "https://atnd.ak4.jp/api/cooperation";
const CORPORATE_ID = "<企業IDを書く>";
const AKASHI_REQEST_URL = AKASHI_API_URL + CORPORATE_ID;
const AKASHI_API_TOKEN = "<アクセストークンを書く>";
const GET_START_TIME = "080000";
const GET_END_TIME = "092000";

//管理下従業員のステータスを取得する関数
function getStaffsStatus(){

    const AKASHI_API_PARAM = "/staffs";
    let PAGE_NUMBER = 0;
    let REQUEST_URI = `${AKASHI_REQEST_URL}${AKASHI_API_PARAM}?token=${AKASHI_API_TOKEN}&page=${PAGE_NUMBER}`
    
    let objectStaffsStatus = UrlFetchApp.fetch(REQUEST_URI).getContentText();
    let responseObject

    // APIの成功判定
    if(objectStaffsStatus['success'] != true){
        console.log("APIからの情報取得に失敗しました");
        return objectStaffsStatus['errors'];
    }
    else{
        responseObject = objectStaffsStatus["response"];
    }

    // 管理下の従業員全員分の情報を取得する
    // TODO:管理下の従業員が20人より多いとき、このメソッドが正常に動作するか確認する
    if(responseObject["TotalCount"] > 20){
        let countMember = responseObject["TotalCount"];
        countMember -= 20;
        let counter = 1;
        while(true){
            PAGE_NUMBER = counter;
            REQUEST_URI = `${AKASHI_REQEST_URL}${AKASHI_API_PARAM}?token=${AKASHI_API_TOKEN}&page=${PAGE_NUMBER}`
            objectStaffsStatus = UrlFetchApp.fetch(REQUEST_URI).getContentText();

            // APIの成功判定
            if(objectStaffsStatus['success'] != true){
                console.log("APIからの情報取得に失敗しました");
                return objectStaffsStatus['errors'];
            }
            else{
                Object.assign(responseObject, objectStaffsStatus["response"]);
            }
            
            countMember -= 20;

            // 全員分取得でいたらループから抜け出す
            if(countMember <= 0) 
                break

            counter += 1;
        }
    }
    logger.Log(responseObject)
    return responseObject
}

// 管理下従業員のidを「,」区切りの文字列にする関数
function shapingStafsId(StaffsObject){
    staffsIds = ""
    for (const staff in StaffsObject["staffs"]){
        staffsIds += `${staff["staffId"]},`;
    }
    // 末尾のカンマを削除
    var staffsIds = staffsIds.slice( 0, -1 );
    logger.log(staffsIds);
    return staffsIds
}

function getMultipleStamps() {

    const AKASHI_API_PARAM = "/multiple_stamps";
    
    const REQUEST_URI = `${AKASHI_REQEST_URL}${AKASHI_API_PARAM}?token=${AKASHI_API_TOKEN}&start_date=${GET_START_TIME}&end_date=${GET_END_TIME}`

    let objectMultipleStamps = UrlFetchApp.fetch(REQUEST_URI).getContentText();

    return objectMultipleStamps
}
