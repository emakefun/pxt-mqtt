
const EMMQTT_BOOL_TYPE_IS_TRUE = true
const EMMQTT_BOOL_TYPE_IS_FALSE = false
const EMMQTT_ERROR_TYPE_IS_SUCCE = 0
const EMMQTT_ERROR_TYPE_IS_ERR = 1
const EMMQTT_ERROR_TYPE_IS_WIFI_CONNECT_TIMEOUT = -1
const EMMQTT_ERROR_TYPE_IS_WIFI_CONNECT_FAILURE = -2
const EMMQTT_ERROR_TYPE_IS_MQTT_CONNECT_TIMEOUT = -4
const EMMQTT_ERROR_TYPE_IS_MQTT_CONNECT_FAILURE = -5
const EMMQTT_STR_TYPE_IS_NONE = ""


/**
 *mqtt implementation method.
 */
//% weight=10 color=#008B00 icon="\uf1eb" block="MQTT"
namespace MQTT {
    let rev: string;
    //serial
    let EMMQTT_SERIAL_INIT = EMMQTT_BOOL_TYPE_IS_FALSE
    let EMMQTT_SERIAL_TX = SerialPin.P2
    let EMMQTT_SERIAL_RX = SerialPin.P1
    let MQTT_SSID = EMMQTT_STR_TYPE_IS_NONE;
    let MQTT_SSIDPWD = EMMQTT_STR_TYPE_IS_NONE;
    let MQTT_CLIENT_ID = EMMQTT_STR_TYPE_IS_NONE;
    let MQTT_CLIENT_NAME = EMMQTT_STR_TYPE_IS_NONE;
    let MQTT_CLIENT_PASSWORD = EMMQTT_STR_TYPE_IS_NONE;
    let MQTT_SERVER_IP = EMMQTT_STR_TYPE_IS_NONE;
    let MQTT_SERVER_PORT = 1883;
    let HTTP_RESPONSE_STR = EMMQTT_STR_TYPE_IS_NONE;
    let HTTP_CONNECT_STATUS = EMMQTT_BOOL_TYPE_IS_FALSE;
    let MQTT_TOPIC: any = EMMQTT_STR_TYPE_IS_NONE
    let MQTT_MESSGE: any = EMMQTT_STR_TYPE_IS_NONE
    let HTTP_RESULT = EMMQTT_STR_TYPE_IS_NONE;
    
    let EMMQTT_ANSWER_CMD = EMMQTT_STR_TYPE_IS_NONE
    let EMMQTT_ANSWER_CONTENT = EMMQTT_STR_TYPE_IS_NONE
	//阿里云三要素
	let EMMQTT_ALIYUN_PRODUCTKEY = EMMQTT_STR_TYPE_IS_NONE
	let EMMQTT_ALIYUN_DEVICENAME = EMMQTT_STR_TYPE_IS_NONE
	let EMMQTT_ALIYUN_DEVICESECRET = EMMQTT_STR_TYPE_IS_NONE
    // //animation
    let EMMQTT_WIFI_ICON = 1
    let EMMQTT_MQTT_ICON = 1

    const mqttSubscribeHandlers: { [topic: string]: (message: string) => void } = {}

    export class PacketaMqtt {
       
        
        public message: string;
    }

    //% advanced=true shim=Emmqtt::emmqttClearRxBuffer
    function emmqttClearRxBuffer(): void {
        return
    }

    //% advanced=true shim=Emmqtt::emmqttClearTxBuffer
    function emmqttClearTxBuffer(): void {
        return
    }



    function emmqttWriteString(text: string): void {
        serial.writeString(text)
    }


    function Em_mqtt_icon_display(): void {
        switch (EMMQTT_MQTT_ICON) {
            case 1: {
                basic.clearScreen()
                led.plot(4, 0)
                EMMQTT_MQTT_ICON += 1
            } break;
            case 2: {
                led.plot(2, 0)
                led.plot(2, 1)
                led.plot(3, 2)
                led.plot(4, 2)
                EMMQTT_MQTT_ICON += 1
            } break;
            case 3: {
                led.plot(0, 0)
                led.plot(0, 1)
                led.plot(0, 2)
                led.plot(1, 3)
                led.plot(2, 4)
                led.plot(3, 4)
                led.plot(4, 4)
                EMMQTT_MQTT_ICON = 1
            } break;
        }
    }

    function emmqtt_serial_init(): void {
        let item = null;
        //First send data through usb, avoid the first data scrambled.
        // obloqWriteString("123")
        item = serial.readString()
        item = serial.readString()
        item = serial.readString()
        serial.redirect(
            EMMQTT_SERIAL_TX,
            EMMQTT_SERIAL_RX,
            BaudRate.BaudRate9600
        )
        serial.setTxBufferSize(128);
        serial.setRxBufferSize(128);
        // obloqWriteString("\r")
        item = serial.readString()
        EMMQTT_SERIAL_INIT = EMMQTT_BOOL_TYPE_IS_TRUE
        emmqttClearRxBuffer();
        // serial.clearRxBuffer();
        emmqttClearTxBuffer();
        // serial.clearTxBuffer();
        // onEvent();
    }

    /**
     * @param SSID to SSID ,eg: "yourSSID"
     * @param PASSWORD to PASSWORD ,eg: "yourPASSWORD"
     * @param receive to receive ,eg: SerialPin.P1
     * @param send to send ,eg: SerialPin.P2
    */
    //% weight=103
    //% receive.fieldEditor="gridpicker" receive.fieldOptions.columns=3
    //% send.fieldEditor="gridpicker" send.fieldOptions.columns=3
    //% blockId=em_mqtt_setup
    //% block="WIFI连接 | 引脚设置: | 接收数据 TX: %receive| 发送数据 RX: %send | WIFI: | 名称: %SSID| 密码: %PASSWORD 启动连接"
    //% subcategory="WIFI连接"
    export function em_wifi_connect(/*serial*/receive: SerialPin, send: SerialPin,
        /*wifi*/SSID: string, PASSWORD: string
        ): void {
        EMMQTT_SERIAL_TX = send;
        EMMQTT_SERIAL_RX = receive;
        MQTT_SSID = SSID;
        MQTT_SSIDPWD = PASSWORD;
        emmqtt_serial_init();
        emqtt_connect_wifi();

        // 
    }

    /**
     * 
     * @param clientId to clientId ,eg: "yourClientId"
     * @param username to username ,eg: "yourClientName"
     * @param clientPwd to clientPwd ,eg: "yourClientPwd"
     * @param serverIp to serverIp ,eg: "yourServerIp"
     * @param serverPort to serverPort ,eg: 1883  
 
    */
    //% weight=102
    //% receive.fieldEditor="gridpicker" receive.fieldOptions.columns=3
    //% send.fieldEditor="gridpicker" send.fieldOptions.columns=3
    //% blockId=em_mqtt_connect
    //% block="MQTT物联网服务初始设置 | 服务器: %serverIp| 端口: %serverPort || 客户端ID: %clientId | 客户端用户名: %username | 客户端密码: %clientPwd"
    //% subcategory="MQTT模式"
    export function em_mqtt_connect(/*mqtt*/ serverIp: string, serverPort: number, clientId?: string, username?: string, clientPwd?: string
        ): void {
       
        // Emmqtt_serial_init();
        // emqtt_connect_wifi();
        MQTT_CLIENT_ID = clientId;
        MQTT_CLIENT_NAME = username;
        MQTT_CLIENT_PASSWORD = clientPwd;
        MQTT_SERVER_IP = serverIp;
        MQTT_SERVER_PORT = serverPort;
        emmqtt_connect_iot("mqtt");
    }
	
	/**
     * 
     * @param clientId to clientId ,eg: "yourClientId"
     * @param username to username ,eg: "yourClientName"
	 * @param productKey ,eg: "productKey"
	 * @param deviceName ,eg: "deviceName"
	 * @param deviceSecret ,eg: "deviceSecret"
     * @param clientPwd to clientPwd ,eg: "yourClientPwd"
     * @param serverIp to serverIp ,eg: "yourServerIp"
     * @param serverPort to serverPort ,eg: 1883  
 
    */
    //% weight=101
    //% receive.fieldEditor="gridpicker" receive.fieldOptions.columns=3
    //% send.fieldEditor="gridpicker" send.fieldOptions.columns=3
    //% blockId=em_mqtt_aliyun_connect
    //% block="MQTT模块连接阿里云服务初始设置 | 阿里云服务器: %serverIp| 端口: %serverPort| 产品key: %productKey|设备名称: %deviceName|设备秘钥: %deviceSecret  || 客户端ID: %clientId | 客户端用户名: %username | 客户端密码: %clientPwd"
    //% subcategory="ALIYUNMQTT模式"
    export function em_mqtt_aliyun_connect(/*mqtt*/ serverIp: string, serverPort: number, productKey: string, deviceName: string, deviceSecret: string, clientId?: string, username?: string, clientPwd?: string
        ): void {
       
        // Emmqtt_serial_init();
        // emqtt_connect_wifi();
        MQTT_CLIENT_ID = clientId;
        MQTT_CLIENT_NAME = username;
        MQTT_CLIENT_PASSWORD = clientPwd;
        MQTT_SERVER_IP = serverIp;
        MQTT_SERVER_PORT = serverPort;
		
		EMMQTT_ALIYUN_PRODUCTKEY = productKey;
		EMMQTT_ALIYUN_DEVICENAME = deviceName;
		EMMQTT_ALIYUN_DEVICESECRET = deviceSecret;
        emmqtt_connect_iot("aliyun");
    }


    

    //% blockId=mqtt_publish_basic block="MQTT向话题(TOPIC) %topic 发送数据 %data"
    //% weight=100
    //% subcategory="MQTT模式"
    export function em_mqtt_publish_basic(topic: string, data: any): void {
        //AT+MQTTPUB=0,"topic","test",1,0
        // mqtt_publish(topic, data, 1, 0);
        if (!EMMQTT_SERIAL_INIT) {
            emmqtt_serial_init()
        }
        topic = topic.replace(",", "");
        serial.writeString("AT+MQTTPUB=0,\"" + topic + "\",\"" + data + "\",1,0\r\n");
        basic.pause(200); // limit user pub rate
    }

    /**
     * Set MQTT subscribe
     * @param topic Mqtt topic; eg: test
     * @param qos QOS; eg: 0
    */
    //% blockId=mqtt_subscribe block="MQTT订阅话题 %topic|QOS %qos"
    //% weight=101
    //% subcategory="MQTT模式"
    export function em_mqtt_subscribe(topic: string, qos: number): void {
        if (!EMMQTT_SERIAL_INIT) {
            emmqtt_serial_init()
        }
        topic = topic.replace(",", "");
        serial.writeString("AT+MQTTSUB=0,\"" + topic + "\"," + qos + "\r\n");
        basic.pause(500);
    }

    /**
     * 
     * @param topic Mqtt topic; eg: test
     * @param qos QOS; eg: 0
    */
    //% blockId=em_mqtt_get_topic_message block="MQTT获取主题 %topic 数据"
    //% weight=100
    //% subcategory="MQTT模式"
    export function em_mqtt_get_topic_message(topic: string,  handler: (message: string) => void) {
        if (!EMMQTT_SERIAL_INIT) {
            emmqtt_serial_init()
        }
        mqttSubscribeHandlers[topic] = handler;
    }



    function emqtt_connect_wifi(): void {
		atReset();
        serial.writeString("AT+CWMODE=3\r\n");
        basic.pause(100);
        serial.writeString("AT+CWJAP=\"" + MQTT_SSID + "\",\"" + MQTT_SSIDPWD + "\"\r\n");
        basic.pause(7000);
		
    }
	
	function atReset(): void {
		for (let i = 0; i < 3; i++) {
			serial.writeString("AT\r\n");
			basic.pause(1000);
		}
        serial.writeString("AT+CWQAP\r\n");
		serial.writeString("AT+RST\r\n");
		// basic.pause(100);
		serial.writeString("ATE0\r\n");
		// basic.pause(100);
		serial.writeString("AT+CWAUTOCONN=0\r\n");
		// basic.pause(100);
		serial.writeString("AT+CWMODE=1\r\n");
		basic.pause(200);
		serial.writeString("AT+CIPMUX=1\r\n");
		// basic.pause(100);
		serial.writeString("AT+CIPDINFO=1\r\n");
		// basic.pause(100);
		serial.writeString("AT+CWAUTOCONN=0\r\n");
		// basic.pause(100);
		serial.writeString("AT+CWDHCP=1,1\r\n");
		basic.pause(200);
	}

    function emmqtt_connect_mqtt(): void {
        if (!EMMQTT_SERIAL_INIT) {
            emmqtt_serial_init()
        }
        serial.writeString("AT+MQTTUSERCFG=0,1,\"" + MQTT_CLIENT_ID + "\",\"" + MQTT_CLIENT_NAME + "\",\"" + MQTT_CLIENT_PASSWORD + "\",0,0,\"\"\r\n");
        basic.pause(200);
        serial.writeString("AT+MQTTCONN=0,\"" + MQTT_SERVER_IP + "\"," + MQTT_SERVER_PORT + ",0\r\n");
        basic.pause(1000);
        // serial.writeString("AT+CIFSR\r\n");
    }
	
	function emmqtt_connect_aliyun_mqtt(): void {
        if (!EMMQTT_SERIAL_INIT) {
            emmqtt_serial_init()
        }
        serial.writeString("AT+MQTTUSERCFG=0,1,\"" + MQTT_CLIENT_ID + "\",\"" + MQTT_CLIENT_NAME + "\",\"" + MQTT_CLIENT_PASSWORD + "\",0,0,\"\"\r\n");
        basic.pause(200);
        serial.writeString("AT+ALIYUN_MQTTCONN=\"" + MQTT_SERVER_IP + "\"," + MQTT_SERVER_PORT + ",\"" + EMMQTT_ALIYUN_PRODUCTKEY + "\",\"" + EMMQTT_ALIYUN_DEVICENAME + "\",\"" + EMMQTT_ALIYUN_DEVICESECRET + "\"\r\n");
        basic.pause(1000);
        // serial.writeString("AT+CIFSR\r\n");
    }
	
    function emmqtt_connect_http(): void {
        if (!EMMQTT_SERIAL_INIT) {
            emmqtt_serial_init()
        }
        serial.writeString("AT+CIPSTART=\"TCP\",\"" + MQTT_SERVER_IP + "\"," + MQTT_SERVER_PORT + "\r\n");
        basic.pause(1000);
        
    }




    function emmqtt_connect_iot(type: string): number {
        EMMQTT_MQTT_ICON = 1
        let iconnum = 0
        let _timeout = 0
        if (type == "http") {
            emmqtt_connect_http();
        }else if (type == "mqtt"){
            emmqtt_connect_mqtt();
        }else if (type == "aliyun") {
			emmqtt_connect_aliyun_mqtt();
		}
        while (_timeout < 1000) {
            if (_timeout % 50 == 0) {
                Em_mqtt_icon_display()
                iconnum += 1;
            }
            if (EMMQTT_ANSWER_CMD == "MqttWifiConneted") {
                EMMQTT_ANSWER_CMD = EMMQTT_STR_TYPE_IS_NONE
                break
            } else if (EMMQTT_ANSWER_CMD == "MqttWifiConnectFailure") {
                EMMQTT_ANSWER_CMD = EMMQTT_STR_TYPE_IS_NONE
                return EMMQTT_ERROR_TYPE_IS_MQTT_CONNECT_FAILURE
            }
            basic.pause(1)
            _timeout += 1
        }
        if (_timeout >= 1000 && EMMQTT_ANSWER_CMD != "MqttWifiConneted") {
            EMMQTT_ANSWER_CMD = EMMQTT_STR_TYPE_IS_NONE
            return EMMQTT_ERROR_TYPE_IS_MQTT_CONNECT_TIMEOUT
        }
        return EMMQTT_ERROR_TYPE_IS_SUCCE
        //basic.showString("ok")
    }
    let Emqtt_message_str = "";
    let count = 0;
    serial.onDataReceived(serial.delimiters(Delimiters.NewLine), function () {
        Emqtt_message_str += serial.readString();
        let size = Emqtt_message_str.length;
        let item: string = Emqtt_message_str + "";
        // basic.showString(item);
        // emmqttClearRxBuffer();
        if (item.indexOf("WIFI CONNECTED", 0) != -1) {
            EMMQTT_ANSWER_CMD = "MqttWifiConneted"
            EMMQTT_ANSWER_CONTENT = EMMQTT_STR_TYPE_IS_NONE
            // basic.showString("mqtt connect success!");
            basic.showIcon(IconNames.Yes)
            basic.pause(1000);
            Emqtt_message_str = "";
            return
        } else if (item.indexOf("WIFI DISCONNECT", 0) != -1) {
            EMMQTT_ANSWER_CMD = "MqttWifiConnectFailure"
            basic.showIcon(IconNames.No)
            Emqtt_message_str = "";
            return
        } else if (item.includes("MQTTSUBRECV")) {
            // item = item.slice(item.indexOf("MQTTSUBRECV"))
            item = item.replace("+MQTTSUBRECV:", "");
            item = item.replace("MQTTSUBRECV:", "");
            // basic.showString(item);
            // let recvStringSplit = item.split(":")
            let splitStr  = item.split(",");
            let message = splitStr[1];
            let resStr = "";
            resStr = message.slice(0, message.length - 2)
            if(resStr.includes("+")){
                let messageSplit = resStr.split("+");
                let messageStr = messageSplit[0]
                if(messageStr.includes("AT")){
                    resStr = messageStr.slice(0, messageStr.length - 4)
                }else{
                    resStr = messageStr.slice(0, messageStr.length - 2)
                }
            }
            MQTT_MESSGE = resStr;
            let topicStr = splitStr[0];
            MQTT_TOPIC = topicStr;
            mqttSubscribeHandlers[MQTT_TOPIC] && mqttSubscribeHandlers[MQTT_TOPIC](MQTT_MESSGE)
            EMMQTT_ANSWER_CMD = "SubOk"
            EMMQTT_ANSWER_CONTENT = EMMQTT_STR_TYPE_IS_NONE
            Emqtt_message_str = "";
            return
        }else if (item.indexOf("STATUS:3", 0) != -1){
            Emqtt_message_str = "";
            HTTP_CONNECT_STATUS = EMMQTT_BOOL_TYPE_IS_TRUE
        }else if (item.indexOf("STATUS:4", 0) != -1) {
            Emqtt_message_str = "";
            HTTP_CONNECT_STATUS = EMMQTT_BOOL_TYPE_IS_FALSE
        }else if (item.indexOf("HTTP/1.1 200 OK") != -1) {
            Emqtt_message_str = "";
            count = 1;
            // basic.showNumber(0);
            // let dataArr = item.split("\r\n\r\n");
            // basic.showNumber(dataArr.length);
            // let resultStr = dataArr[dataArr.length - 1];
            // basic.showString(item);
        }else if(item == '0'){
            count = 0;
            Emqtt_message_str = "";
        } 
         else {
            Emqtt_message_str = "";
             if(count > 0){
                // count++;
                // basic.showNumber(count);
                HTTP_RESPONSE_STR += item + "emok";
             }
            //  basic.showString(item);
            return
        }
        
    });

    /**
     * 
     * @param clientId to clientId ,eg: "yourClientId"
     * @param username to username ,eg: "yourClientName"
     * @param clientPwd to clientPwd ,eg: "yourClientPwd"
     * @param serverIp to serverIp ,eg: "yourServerIp"
     * @param serverPort to serverPort ,eg: 80  
 
    */
    //% weight=99
    //% receive.fieldEditor="gridpicker" receive.fieldOptions.columns=3
    //% send.fieldEditor="gridpicker" send.fieldOptions.columns=3
    //% blockId=em_http_connect
    //% block="MQTT物联网模块连接HTTP服务器 服务器地址 %serverIp 端口 %serverPort"
    //% subcategory="HTTP模式"
    export function em_http_connect(/*mqtt*/ serverIp: string, serverPort: number
        ): void {
        // Emmqtt_serial_init();
        // emqtt_connect_wifi();
        // MQTT_CLIENT_ID = clientId;
        // MQTT_CLIENT_NAME = username;
        // MQTT_CLIENT_PASSWORD = clientPwd;
        MQTT_SERVER_IP = serverIp;
        MQTT_SERVER_PORT = serverPort;
        emmqtt_connect_iot("http");
        serial.writeString("AT+CIPSTATUS\r\n");
        basic.pause(50);
        while (!HTTP_CONNECT_STATUS) {
            emqtt_connect_wifi();
            emmqtt_connect_http();
            serial.writeString("AT+CIPSTATUS\r\n");
            basic.pause(50);
            // return;
        }
        // serial.setRxBufferSize(500);
    }

    //% blockId=em_http_get block="物联网模块HTTP模式发送GET请求地址%topic"
    //% weight=98
    //% subcategory="HTTP模式"
    export function em_http_get(topic: string): string {
        if (!EMMQTT_SERIAL_INIT) {
            emmqtt_serial_init();
        }
        serial.writeString("AT+CIPSTATUS\r\n");
        basic.pause(50);
        while (!HTTP_CONNECT_STATUS) {
            emqtt_connect_wifi();
            emmqtt_connect_http();
            serial.writeString("AT+CIPSTATUS\r\n");
            basic.pause(50);
            // return;
        }
        serial.writeString("AT+CIPMODE=1\r\n");
        basic.pause(50);
        serial.writeString("AT+CIPSEND\r\n");
        basic.pause(50);
        getMethod(topic);
        // return topic == MQTT_TOPIC?MQTT_MESSGE:"";
        // basic.pause(100);
        serial.writeString("+++");
        basic.pause(1200);
        serial.writeString("AT+CIPMODE=0\r\n");
        basic.pause(50);
        serial.writeString("AT+CIPSTART=\"TCP\",\"" + MQTT_SERVER_IP + "\"," + MQTT_SERVER_PORT + "\r\n");
        basic.pause(50);
        return HTTP_RESULT;
        // return "";
    }

    function getMethod(topic: string): void{
        emmqttClearRxBuffer();
        let startStr = topic.substr(0, 1);
        if (startStr != "/") topic = "/" + topic;
        // basic.showString("a");
        let requestStr = "GET " + topic + " HTTP/1.1\r\n";
        if(!hasLetter(MQTT_SERVER_IP)){
            requestStr += "Host: " + MQTT_SERVER_IP + ":" + MQTT_SERVER_PORT + "\r\n";
        }else{
            requestStr += "Host: " + MQTT_SERVER_IP + "\r\n";
        }
        requestStr += "Content-Type: text/plain;charset=UTF-8\r\n";
        requestStr += "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.114 Safari/537.36\r\n";
        requestStr += "Connection: keep-alive\r\n\r\n";
        // serial.setRxBufferSize(200);
        serial.writeString(requestStr);
        basic.pause(1000);
       
        let arr = HTTP_RESPONSE_STR.split("emok");
        // basic.showNumber(arr.length);
        if(arr.length >  4){
            let result = arr[arr.length - 4];
            HTTP_RESULT = (result.substr(0, result.length - 2));
        } 
        HTTP_RESPONSE_STR = EMMQTT_STR_TYPE_IS_NONE;
    }
    
    function hasLetter(str: string) {
        for (let i = 0; i < str.length; i++) {
            let asc = str.charCodeAt(i);
            if ((asc >= 65 && asc <= 90 || asc >= 97 && asc <= 122)) {
                return true;
            }
        }
        return false;
    }
} 