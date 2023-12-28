import request from 'request';
require('dotenv').config();

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const IMAGE_GET_STARTED =
    'https://cdn.bookingcare.vn/fo/2023/11/02/134537-group-12314.png';
let callSendAPI = (sender_psid, response) => {
    // Construct the message body
    let request_body = {
        recipient: {
            id: sender_psid,
        },
        message: response,
    };

    // Send the HTTP request to the Messenger Platform
    request(
        {
            uri: 'https://graph.facebook.com/v2.6/me/messages',
            qs: { access_token: PAGE_ACCESS_TOKEN },
            method: 'POST',
            json: request_body,
        },
        (err, res, body) => {
            if (!err) {
                console.log('message sent!');
            } else {
                console.error('Unable to send message:' + err);
            }
        }
    );
};

let getUserName = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        // Send the HTTP request to the Messenger Platform
        await request(
            {
                uri: `https://graph.facebook.com/${sender_psid}?fields=first_name,last_name,profile_pic&access_token=${PAGE_ACCESS_TOKEN}`,
                qs: { access_token: PAGE_ACCESS_TOKEN },
                method: 'GET',
            },
            (err, res, body) => {
                if (!err) {
                    let response = JSON.parse(body);
                    let username = `${response.first_name} ${response.last_name}`;
                    resolve(username);
                } else {
                    console.error('Unable to send message:' + err);
                    reject(err);
                }
            }
        );
    });
};

let handleGetStarted = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let username = await getUserName(sender_psid);
            let response1 = {
                text: `Hello ${username}, I'm a bot. What can I do for you?`,
            };
            let response2 = await sendGetStarted();
            console.log('check response2', response2);
            await callSendAPI(sender_psid, response1);
            await callSendAPI(sender_psid, response2);
            resolve('done');
        } catch (e) {
            reject(e);
        }
    });
};

let sendGetStarted = () => {
    let response = {
        attachment: {
            type: 'template',
            payload: {
                template_type: 'generic',
                elements: [
                    {
                        title: 'Xin chhào mừng bạn đến với Booking Health Care!',
                        subtitle: 'Dưới đây là các lựa chọn',
                        image_url: IMAGE_GET_STARTED,
                        buttons: [
                            {
                                type: 'postback',
                                title: 'How to Book?',
                                payload: 'BOOKING',
                            },
                            {
                                type: 'postback',
                                title: 'View doctors',
                                payload: 'VIEW_DOCTORS',
                            },
                            {
                                type: 'postback',
                                title: 'View specialities',
                                payload: 'VIEW_SPECIALITIES',
                            },
                            {
                                type: 'postback',
                                title: 'GUIDE TO USE',
                                payload: 'GUIDE_TO_USE',
                            },
                        ],
                    },
                ],
            },
        },
    };
    return response;
};

module.exports = {
    handleGetStarted: handleGetStarted,
};
