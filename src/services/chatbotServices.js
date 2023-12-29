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
    console.log('check message', request_body.message);

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
        request(
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
            let response2 = sendGetStartedTemplate();

            console.log('check response2', response2);

            callSendAPI(sender_psid, response1);
            callSendAPI(sender_psid, response2);
            resolve('done');
        } catch (e) {
            reject(e);
        }
    });
};

let sendGetStartedTemplate = async () => {
    let response = {
        attachment: {
            type: 'template',
            payload: {
                template_type: 'generic',
                elements: [
                    {
                        title: 'Welcome!',
                        image_url:
                            'https://petersfancybrownhats.com/company_image.png',
                        subtitle: 'We have the right hat for everyone.',
                        default_action: {
                            type: 'web_url',
                            url: 'https://petersfancybrownhats.com/view?item=103',
                            messenger_extensions: false,
                            webview_height_ratio: 'tall',
                            fallback_url: 'https://petersfancybrownhats.com/',
                        },
                        buttons: [
                            {
                                type: 'web_url',
                                url: 'https://petersfancybrownhats.com',
                                title: 'View Website',
                            },
                            {
                                type: 'postback',
                                title: 'Start Chatting',
                                payload: 'DEVELOPER_DEFINED_PAYLOAD',
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
