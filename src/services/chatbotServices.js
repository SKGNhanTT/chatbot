import request from 'request';
require('dotenv').config();

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

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
            let response = {
                text: `Hello ${username}, Welcome to Booking Health Care!`,
            };
            let response2 = getStartedTemplate();

            callSendAPI(sender_psid, response);
            callSendAPI(sender_psid, response2);
            resolve('done');
        } catch (e) {
            reject(e);
        }
    });
};

let getStartedTemplate = () => {
    let response = {
        attachment: {
            type: 'template',
            payload: {
                template_type: 'generic',
                elements: [
                    {
                        title: 'What can I do for you?',
                        subtitle: 'Here is the guide on how to use.',
                        image_url:
                            'https://cdn.bookingcare.vn/fo/2023/11/02/134537-group-12314.png',
                        buttons: [
                            {
                                type: 'postback',
                                title: 'Schedule an Examination',
                                payload: 'BOOKING',
                            },
                            {
                                type: 'postback',
                                title: 'View specialities',
                                payload: 'VIEW_SPECIALITIES',
                            },
                            {
                                type: 'postback',
                                title: 'View doctors',
                                payload: 'VIEW_DOCTORS',
                            },
                        ],
                    },
                ],
            },
        },
    };
    return response;
};

let handleGetSpecialties = (sender_psid) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response = {
                attachment: {
                    type: 'template',
                    payload: {
                        template_type: 'generic',
                        elements: [
                            {
                                title: 'Danh sách các chuyên khoa',
                                subtitle: 'Chọn chuyên khoa bạn muốn tìm kiếm',
                                image_url:
                                    'https://cdn.bookingcare.vn/fo/2023/11/02/134537-group-12314.png',
                                buttons: [
                                    {
                                        type: 'postback',
                                        title: 'Chuyên khoa 1',
                                        payload: 'SPECIALTY_1',
                                    },
                                ],
                            },
                            {
                                title: 'Danh sách các chuyên khoa',
                                subtitle: 'Chọn chuyên khoa bạn muốn tìm kiếm',
                                image_url:
                                    'https://cdn.bookingcare.vn/fo/2023/11/02/134537-group-12314.png',
                                buttons: [
                                    {
                                        type: 'postback',
                                        title: 'Chuyên khoa 1',
                                        payload: 'SPECIALTY_1',
                                    },
                                ],
                            },
                        ],
                    },
                },
            };
            callSendAPI(sender_psid, response);
            resolve('done');
        } catch (e) {
            reject(e);
        }
    });
};

module.exports = {
    handleGetStarted: handleGetStarted,
    handleGetSpecialties: handleGetSpecialties,
};
