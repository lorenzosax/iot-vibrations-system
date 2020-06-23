/* WiFi Example
 * Copyright (c) 2016 ARM Limited
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#include "mbed.h"
#include "TCPSocket.h"
#include "XNucleoIKS01A2.h"
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include <string>

#if TARGET_UBLOX_EVK_ODIN_W2
#include "OdinWiFiInterface.h"
OdinWiFiInterface wifi;

#else
#if !TARGET_FF_ARDUINO
#error [NOT_SUPPORTED] Only Arduino form factor devices are supported at this time
#endif
#include "ESP8266Interface.h"

ESP8266Interface wifi(MBED_CONF_APP_WIFI_TX, MBED_CONF_APP_WIFI_RX);

#endif

static XNucleoIKS01A2 *mems_expansion_board = XNucleoIKS01A2::instance(D14, D15, D4, D5);

static LSM6DSLSensor *acc_gyro = mems_expansion_board->acc_gyro;

bool flag = false;
Ticker t;

void enableMeasure()
{
	flag = true;
}

const char *sec2str(nsapi_security_t sec)
{
    switch (sec) {
        case NSAPI_SECURITY_NONE:
            return "None";
        case NSAPI_SECURITY_WEP:
            return "WEP";
        case NSAPI_SECURITY_WPA:
            return "WPA";
        case NSAPI_SECURITY_WPA2:
            return "WPA2";
        case NSAPI_SECURITY_WPA_WPA2:
            return "WPA/WPA2";
        case NSAPI_SECURITY_UNKNOWN:
        default:
            return "Unknown";
    }
}

void scan(WiFiInterface *wifi)
{
    WiFiAccessPoint *ap;

    printf("Scan:\r\n");

    int count = wifi->scan(NULL,0);

    /* Limit number of network arbitrary to 15 */
    count = count < 15 ? count : 15;

    ap = new WiFiAccessPoint[count];
    count = wifi->scan(ap, count);
    for (int i = 0; i < count; i++)
    {
        printf("Network: %s secured: %s BSSID: %hhX:%hhX:%hhX:%hhx:%hhx:%hhx RSSI: %hhd Ch: %hhd\r\n", ap[i].get_ssid(),
               sec2str(ap[i].get_security()), ap[i].get_bssid()[0], ap[i].get_bssid()[1], ap[i].get_bssid()[2],
               ap[i].get_bssid()[3], ap[i].get_bssid()[4], ap[i].get_bssid()[5], ap[i].get_rssi(), ap[i].get_channel());
    }
    printf("%d networks available.\r\n", count);

    delete[] ap;
}

void http_demo(NetworkInterface *net)
{
    TCPSocket socket;

    printf("Sending HTTP request to www.arm.com...\r\n");

    // Open a socket on the network interface, and create a TCP connection to www.arm.com
    socket.open(net);
    socket.connect("www.arm.com", 80);

    // Send a simple http request
    char sbuffer[] = "GET / HTTP/1.1\r\nHost: www.arm.com\r\n\r\n";
    int scount = socket.send(sbuffer, sizeof sbuffer);
    printf("sent %d [%.*s]\r\n", scount, strstr(sbuffer, "\r\n")-sbuffer, sbuffer);

    // Recieve a simple http response and print out the response line
    char rbuffer[64];
    int rcount = socket.recv(rbuffer, sizeof rbuffer);
    printf("recv %d [%.*s]\r\n", rcount, strstr(rbuffer, "\r\n")-rbuffer, rbuffer);

    // Close the socket to return its memory and bring down the network interface
    socket.close();
}

void http_demo1(NetworkInterface *net, int32_t* axes)
{
    TCPSocket socket;

    printf("Sending HTTP request to 10.252.40.156...\r\n");

    // Open a socket on the network interface, and create a TCP connection to www.arm.com
    socket.open(net);
		//socket.connect("raffranco.altervista.org", 80);
		socket.connect("10.252.40.156", 80);
		
    // Send a simple http request
		/*char c = (char) count;	

		char sbuffer[] = "GET /index.php/?val=st";
		
		char s1buffer[] = " HTTP/1.1\r\nHost: raffranco.altervista.org\r\n\r\n";
		
		std::strcat(sbuffer, &c);
		
		std::strcat(sbuffer, s1buffer);

		printf("%s", sbuffer);*/
	
		//char sbuffer[] = "GET /index.php?location=LABPOLI!!&x=1540&y=-1451&z=-1653 HTTP/1.1\r\nHost: 10.252.40.156\r\n\r\n";
		
		string x = to_string(axes[0]);
		string y = to_string(axes[1]);
		string z = to_string(axes[2]);
		
		char sbuffer[90];
		
		strcat(sbuffer, "GET /index.php?");
		strcat(sbuffer, "location=VAI");
		strcat(sbuffer, "&x="); strcat(sbuffer, x.c_str());
		strcat(sbuffer, "&y="); strcat(sbuffer, y.c_str());
		strcat(sbuffer, "&z="); strcat(sbuffer, z.c_str());
		strcat(sbuffer, " HTTP/1.1\r\nHost: 10.252.40.156\r\n");
		//strcat(sbuffer, " HTTP/1.1\r\nHost: misure2020.herokuapp.com\r\n");
		
		int scount = socket.send(sbuffer, sizeof sbuffer);
    printf("sent %d [%.*s]\r\n", scount, strstr(sbuffer, "\r\n")-sbuffer, sbuffer);

    // Recieve a simple http response and print out the response line
    char rbuffer[64];
    int rcount = socket.recv(rbuffer, sizeof rbuffer);
    printf("recv %d [%s]\r\n", rcount, rbuffer);

    // Close the socket to return its memory and bring down the network interface
    socket.close();
}

void http_send_data(NetworkInterface *net)
{
    TCPSocket socket;

    printf("Sending HTTP POST request to misure2020.herokuapp.com/test...\r\n");

    // Open a socket on the network interface, and create a TCP connection to www.arm.com
    socket.open(net);
    socket.connect("misure2020.herokuapp.com", 80);

    // Send a simple http request
		char sbuffer[] = "POST /test HTTP/1.1\r\nHost: misure2020.herokuapp.com\r\n\r\n";//\r\nContent-Type: application/json\r\n\r\n{\"location\": \"LabPoliTESTs\", \"axes\": [20, 60, 50]}\r\n\r\n";
		//printf("%s\n", sbuffer);
		
		char rafbuffer[] = "POST /vibrations HTTP/1.1\r\nHost: misure2020.herokuapp.com\r\nContent-Type: application/json\r\nCache-Control: no-cache\r\nUser-Agent: Mozilla/5.0\r\n\r\n{\"location\": \"LabMR\", \"axes\": [8, 97, 4]}";
		
		int scount = socket.send(sbuffer, sizeof sbuffer);
    printf("sent %d [%.*s]\r\n", scount, strstr(sbuffer, "\r\n")-sbuffer, sbuffer);

    // Recieve a simple http response and print out the response line
    char rbuffer[2000];
    int rcount = socket.recv(rbuffer, sizeof rbuffer);
    printf("recv %d %s\r\n", rcount, /*strstr(rbuffer, "\r\n")-rbuffer,*/ rbuffer);

		//printf("\n%s\n", rafbuffer);
		
    // Close the socket to return its memory and bring down the network interface
    socket.close();
}

void http_post_send_vibration(NetworkInterface *net, int32_t* axes)
{
    TCPSocket socket;

    printf("Sending HTTP POST request to 10.252.40.156/vibration...\r\n");

    // Open a socket on the network interface, and create a TCP connection
    socket.open(net);
		//socket.connect("misure2020.herokuapp.com", 80);
		socket.connect("10.252.40.156", 3000);
		
		string x = to_string(axes[0]);
		string y = to_string(axes[1]);
		string z = to_string(axes[2]);
 
		char *body = (char*) malloc(150*sizeof(char));
		
		strcat(body, "{\"location\": \"LabPoli\",");
		strcat(body, " \"axes\": [[");
		strcat(body, x.c_str()); 
		strcat(body, ",");
		strcat(body, y.c_str()); 
		strcat(body, ",");
		strcat(body, z.c_str()); 
		strcat(body, "]]}");
	
		body = (char *) realloc(body, (strlen(body)+1)*sizeof(char));
		
		char sbuffer[300] = "POST /vibration HTTP/1.1\r\nHost: 10.252.40.156\r\nContent-Type: application/json\r\nContent-Length: ";
		//char sbuffer[300] = "POST /vibration HTTP/1.1\r\nHost: misure2020.herokuapp.com\r\nContent-Type: application/json\r\nContent-Length: ";
		
		strcat(sbuffer, to_string(strlen(body)+1).c_str());
		strcat(sbuffer, "\r\n\r\n");
		strcat(sbuffer, body);
		strcat(sbuffer, "\r\n\r\n");	
		
		//strcat(sbuffer, "POST /vibrations HTTP/1.1\r\nHost: misure2020.herokuapp.com\r\nContent-Type: application/json\r\n\r\n");
		//strcat(sbuffer, "POST /vibrations HTTP/1.1\r\nHost: misure2020.herokuapp.com\r\nCache-Control: no-cache\r\nContent-Type: application/x-www-form-urlencoded\r\n\r\nX=Raf"); 
		//strcat(sbuffer, "{\r\n");
		
		printf("Richiesta: %s", sbuffer);
	
    // Send a simple http request
    int scount = socket.send(sbuffer, sizeof sbuffer);
    printf("sent %d [%.*s]\r\n", scount, strstr(sbuffer, "\r\n")-sbuffer, sbuffer);

    // Recieve a simple http response and print out the response line
    char rbuffer[2000];
    int rcount = socket.recv(rbuffer, sizeof rbuffer);
    printf("recv %d [%s]\r\n", rcount, rbuffer);

    // Close the socket to return its memory and bring down the network interface
    socket.close();
}
void http_post_send_vibrations(NetworkInterface *net, int32_t axes[][3])
{
    TCPSocket socket;

    printf("Sending HTTP POST request to misure2020.herokuapp.com/vibration...\r\n");

    // Open a socket on the network interface, and create a TCP connection
    socket.open(net);
		//socket.connect("misure2020.herokuapp.com", 80);
		socket.connect("10.252.40.156", 3000);
		char *body = (char*) malloc(1000*sizeof(char));
	
		strcat(body, "{\"location\": \"LabPoli\",");
		strcat(body, " \"axes\": [");
		for(int i = 0; i < 50; i++) {
			string x = to_string(axes[i][0]);
			string y = to_string(axes[i][1]);
			string z = to_string(axes[i][2]);
			strcat(body, "[");
			strcat(body, x.c_str()); 
			strcat(body, ",");
			strcat(body, y.c_str()); 
			strcat(body, ",");
			strcat(body, z.c_str()); 
			strcat(body, "]");
			if(i!=49) strcat(body, ",");
		}
		strcat(body, "]}");		
		body = (char *) realloc(body, (strlen(body)+1)*sizeof(char));

		char sbuffer[1200] = "POST /vibration HTTP/1.1\r\nHost: 10.252.40.156\r\nContent-Type: application/json\r\nContent-Length: ";
		
		strcat(sbuffer, to_string(strlen(body)+1).c_str());
		strcat(sbuffer, "\r\n\r\n");
		strcat(sbuffer, body);
		strcat(sbuffer, "\r\n\r\n");
		
    // Send a simple http request
    int scount = socket.send(sbuffer, sizeof sbuffer);
    printf("sent %d [%.*s]\r\n", scount, strstr(sbuffer, "\r\n")-sbuffer, sbuffer);

    // Recieve a simple http response and print out the response line
    /*char rbuffer[100];
    int rcount = socket.recv(rbuffer, sizeof rbuffer);
    printf("recv %d [%s]\r\n", rcount, rbuffer);*/

    // Close the socket to return its memory and bring down the network interface
    socket.close();
}

void http_get_send_vibration(NetworkInterface *net, int32_t* axes)
{
    TCPSocket socket;

    printf("Sending HTTP GET request to 10.252.40.156/savevibrations...\r\n");

    // Open a socket on the network interface, and create a TCP connection
    socket.open(net);
		//socket.connect("misure2020.herokuapp.com", 80);
		socket.connect("10.252.40.156", 3000);

		string x = to_string(axes[0]);
		string y = to_string(axes[1]);
		string z = to_string(axes[2]);
    // Send a simple http request
	
	/*
		char sbuffer[100] = {'\0'};
		strcat(sbuffer, "GET /savevibrations?");
		strcat(sbuffer, "location=LabPoli_GET");
		strcat(sbuffer, "&x=100"); //strcat(sbuffer, x.c_str());
		strcat(sbuffer, "&y=200"); //strcat(sbuffer, y.c_str());
		strcat(sbuffer, "&z=300"); //strcat(sbuffer, z.c_str());
		strcat(sbuffer, " HTTP/1.1\r\nHost: 10.252.40.156\r\n");*/
		//strcat(sbuffer, " HTTP/1.1\r\nHost: misure2020.herokuapp.com\r\n");
		
		char sbuffer[100] = "GET /savevibrations?location=LabPoli";
		strcat(sbuffer, "&x="); strcat(sbuffer, x.c_str());
		strcat(sbuffer, "&y="); strcat(sbuffer, y.c_str());
		strcat(sbuffer, "&z="); strcat(sbuffer, z.c_str());
		strcat(sbuffer, " HTTP/1.1\r\nHost: 10.252.40.156\r\n\r\n"); 
		/*
		char sbuffer[100] = "GET /savevibrations?location=LABPOLI!!";
		strcat(sbuffer, "&x=");
		strcat(sbuffer, x.c_str());
		strcat(sbuffer, "&y=");
		strcat(sbuffer, y.c_str());
		strcat(sbuffer, "&z=");
		strcat(sbuffer, z.c_str());
		strcat(sbuffer, " HTTP/1.1\r\nHost:");
		strcat(sbuffer, "10.252.40.156\r\n\r\n");
		*/
		printf("Richiesta: %s", sbuffer);
	
    int scount = socket.send(sbuffer, sizeof sbuffer);
    printf("sent %d [%.*s]\r\n", scount, strstr(sbuffer, "\r\n")-sbuffer, sbuffer);

    // Recieve a simple http response and print out the response line
    char rbuffer[2000];
    int rcount = socket.recv(rbuffer, sizeof rbuffer);
    printf("recv %d [%s]\r\n", rcount, rbuffer);

    // Close the socket to return its memory and bring down the network interface
    socket.close();
}

void banner()
	{
	printf("\r\n\r\n");
	printf("###################################\r\n");
	printf("##  (NEW) IoT Node: Vibration    ##\r\n");
	printf("###################################\r\n\r\n");
}

int main()
{
		int32_t group[50][3];
	
		banner();
	
		t.attach(&enableMeasure, 0.001);
		
    scan(&wifi);

		bool success = false;
    printf("\r\nConnecting...\r\n");
	
		/*while (!success) {
			int ret = wifi.connect(MBED_CONF_APP_WIFI_SSID, MBED_CONF_APP_WIFI_PASSWORD, NSAPI_SECURITY_NONE);
			if (ret != 0) {
        printf("\r\nConnection error, retrying...\r\n");
				thread_sleep_for(1500);
			} else {
				printf("Success\r\n\r\n");
				success = true;
			}
		}*/
		
		int ret = wifi.connect( MBED_CONF_APP_WIFI_SSID, 
														MBED_CONF_APP_WIFI_PASSWORD, 
														NSAPI_SECURITY_NONE);
		if (ret != 0) {
			printf("\r\nConnection error!\r\n");
			return -1;
		}

    printf("MAC: %s\r\n", wifi.get_mac_address());
    printf("IP: %s\r\n", wifi.get_ip_address());
    printf("Netmask: %s\r\n", wifi.get_netmask());
    printf("Gateway: %s\r\n", wifi.get_gateway());
    printf("RSSI: %d\r\n\r\n", wifi.get_rssi());

		SocketAddress dns = SocketAddress("10.252.40.254");
		wifi.add_dns_server(dns, "");
		
		// Enable High Pass mode: LSM6DSL_ACC_GYRO_HP_SLOPE_XL_EN -> 1
		acc_gyro->write_reg(LSM6DSL_ACC_GYRO_HP_SLOPE_XL_EN, 1);
		
		acc_gyro->set_x_odr(100);
		
		acc_gyro->enable_x();

		float odr;
		acc_gyro->get_x_odr(&odr);
		
		printf("Output data rate: %f\r\n", odr);
		
		int i = 0;

		while(1) {
			if (flag) {
				
				acc_gyro->get_x_axes(group[i]);
				
				//printf("LSM6DSL [acc/mg]:      %d, %d, %d [%d]\r\n", group[i][0], group[i][1], group[i][2], i);
				i++;
				
				if(i >= 50) {
					http_post_send_vibrations(&wifi, group);
					i = 0;
				}
				flag = false;
			}
		}

    wifi.disconnect();

    printf("\r\nDone\r\n");
}
